const postModel = require('@models/post');
const userModel = require('@models/user');
const dateService = require('@services/dateService');
const langService = require('@services/langService');
const postValidators = require('@validators/post');
const {statuses, readableStatuses} = require('@models/post/postStatus');
const {v4:uuidv4} = require('uuid');

exports.index = async (req, res) => {
    const posts = await postModel.findAll();
    const presentedPosts = posts.map(post => {
        post.jalali_created_at = langService.toPersianNumber(dateService.toPersianDate(post.created_at));
        post.persian_views = langService.toPersianNumber(post.views);
        return post;
    })
    res.adminRender('admin/posts/index', {
        posts: presentedPosts
    })
}

exports.create = async (req, res) => {
    const users = await userModel.findAll(['id', 'full_name']);
    res.adminRender('admin/posts/new', {
        users
    });
}

exports.store = async (req, res) => {
    const fileExt = req.files.thumbnail.name.split('.')[1];
    const newFileName = `${uuidv4()}.${fileExt}`;
    const postData = {
        title: req.body.title,
        author_id: req.body.author,
        slug: req.body.slug,
        content: req.body.content,
        status: req.body.status,
        thumbnail: newFileName
    }

    const errors = postValidators.create(postData);

    if (errors.length > 0) {
        req.flash('errors', 'عملیات با شکست مواجه شد.')
       return res.redirect('/admin/posts/new');
    }
    const insertId = await postModel.create(postData);
    if (insertId) {
        if(req.files.thumbnail){
            const fileNewPath = `${process.env.PWD}/public/upload/thumbnails/${newFileName}`;
            req.files.thumbnail.mv(fileNewPath, err => {
                console.log(err)
            });
        }
        req.flash('success', 'عملیات با موفقیت انجام شد.')
        res.redirect('/admin/posts');
    }
}

exports.remove = async (req, res) => {
    const postID = req.params.postID;
    if (parseInt(postID) === 0) {
        res.redirect('/admin/posts');
    }
    const result = await postModel.delete(postID);
    res.redirect('/admin/posts');
}

exports.edit = async (req, res) => {
    const postID = req.params.postID;
    if (parseInt(postID) === 0) {
        res.redirect('/admin/posts');
    }
    const post = await postModel.find(postID);
    const users = await userModel.findAll(['id', 'full_name']);
    res.adminRender('admin/posts/edit', {
        users,
        post,
        postStatus:statuses(),
        helpers:{
            isPostAuthor: function(userID, options){
                return post.author_id === userID ? options.fn(this) : options.inverse(this)
            },
            isSelectedStatus: function(status, options){
                return post.status === status ? options.fn(this) : options.inverse(this);
            }
        }
    });
}

exports.update = async (req, res) => {
    const postID = req.params.postID;
    if (parseInt(postID) === 0) {
        res.redirect('/admin/posts');
    }
    
   const result = await postModel.update(req.body, postID);
  return res.redirect('/admin/posts');
}