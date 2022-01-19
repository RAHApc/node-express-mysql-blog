const postModel = require('@models/post');
const userModel = require('@models/user');
const commentModel = require('@models/comment');
const dateService = require('@services/dateService');
const postPresenter = require('@presenters/post');
const _ = require('lodash');

exports.showPost = async (req,res) => {
    const postSlug = req.params.post_slug;
    const post = await postModel.findBySlug(postSlug);
    if(!post){
        return res.redirect('/404');
    }
    const user = await userModel.find(post['author_id']);
    post.author = user;
    const comments = await commentModel.findByPostId(post.id);
    const presentComments = comments.map(comment => {
        comment.jalali_created_at = dateService.toPersianDate(comment.created_at);
        return comment;
    });

    const newcomments = _.groupBy(presentComments, 'parent');

    res.frontRender('front/post/single', {post, 
        comments: newcomments[0], 
        bodyClass:'single-post',
        helpers:{
            hasChildren: function(parentId, options){
                return parentId in newcomments;
            },
            getChildren: function(parentId, options){
                return newcomments[parentId];
            }
        }
    });
}