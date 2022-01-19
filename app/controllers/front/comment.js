const postModel = require('@models/post');
const commentModel = require('@models/comment');

exports.store = async (req, res) => {
    const post = await postModel.findBySlug(req.params.post_slug);
    if(!post){
        return res.redirect('/404');
    }
    const commentData = {
        author_id: 'user' in req.session ? parseInt(req.session.user.id) : null,
        post_id:post.id,
        user_name:req.body.user_name,
        user_email:req.body.user_email,
        user_url:req.body.user_url,
        comment:req.body.user_comment
    }
    const result = await commentModel.create(commentData);
    if(result){
        return res.redirect(`/p/${post.slug}`);
    }

}