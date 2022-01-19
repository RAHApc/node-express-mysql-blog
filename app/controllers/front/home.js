const postModel = require('@models/post');
const settingModel = require('@models/setting');
const postPresenter = require('@presenters/post');

exports.index = async (req, res) => {
    const page = 'page' in req.query ? parseInt(req.query.page) : 1;
    const perpage = parseInt(await settingModel.get('posts_per_page'));
    const posts = await postModel.findAll(page, perpage);
    const totalPosts = await postModel.count();
    const totalPages = Math.ceil(totalPosts / perpage);

    const pagination = {
        page,
        totalPages,
        nextPage: page < totalPages ? page + 1 : totalPages,
        prevPage: page > 1 ? page - 1 : 1,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    } 

    const presentPost = posts.map(post => {
        const postPresentInstance = new postPresenter(post);
        post.jalali_date = postPresentInstance.jalaliCreatedAt();
        post.excerpt = postPresentInstance.excerpt();
        return post;
    });

    const latestPosts = await postModel.latestPosts(3);

    res.frontRender('front/home/index', {posts:presentPost, 
        pagination, 
        latestPosts,
        helpers:{
        showDisabled: function(isDisabled, options){
            return !isDisabled ? 'disabled' : '';
        }
    }});
}

exports.search = async (req, res) => {
    const posts = await postModel.findByKeyword(req.query.keyword);
    
    const presentPost = posts.map(post => {
        const postPresentInstance = new postPresenter(post);
        post.jalali_date = postPresentInstance.jalaliCreatedAt();
        post.excerpt = postPresentInstance.excerpt();
        return post;
    })
    res.frontRender('front/home/search', {posts:presentPost});
}