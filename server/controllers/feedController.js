const Post = require('../models/post');
const {validationResult} = require('express-validator');

module.exports.getPosts = (req, res, next) => {

    Post.find()
        .then(posts => {
            if (!posts) {
                posts = [];
            }
            res
                .status(200)
                .json({
                    posts: posts,
                    message: "Posts fetched successfully"
                })
        })

}

module.exports.postAddPost = (req, res, next) => {
    const imageUrl = req.file.filename;
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid input')

        error.statusCode = 422
        error.errors = errors;
        throw error;
    }
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/' + imageUrl,
        creator: "Habib",
        author: "Habib",
    })
    post.save()
        .then(() => {
            res
                .status(201)
                .json({
                    _id: post._id,
                    post: post,
                    message: "Success added post"
                })
        })
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 404;
            next(err);
        })

}
module.exports.getOnePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post')
                error.statusCode = 500;
                throw error;
            }

            return res.status(200)
                .json({
                    post: post
                })
        })
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}