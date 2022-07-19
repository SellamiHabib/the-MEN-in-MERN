const fs = require('fs');
const path = require('path');
const Post = require('../models/post')
const User = require('../models/user');
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
    console.log(req.userId);
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
        author: "Habib",
    })
    console.log(post)
    let creator;
    return post.save()
        .then(() => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(() => {
            return res
                .status(201)
                .json({
                    post: post,
                    creator: {
                        _id: req.userId,
                        name: creator.name
                    }
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
                error.statusCode = 404;
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
module.exports.editPost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const imageUrl = req.file.filename;
    const content = req.body.content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid input')
        error.statusCode = 422
        error.errors = errors;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post')
                error.statusCode = 404;
                throw error;
            }
            fs.unlink(path.join(__dirname, '..', 'images', post.imageUrl), err => {
                if (err) {
                    const error = new Error('File was not deleted');
                    error.statusCode = 500;
                    throw error;
                }
            });
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            res
                .status(201)
                .json({post: post});
            return post.save();
        })
        .then(() => {
            return res;
        })
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}
module.exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            fs.unlink(path.join(__dirname, '..', 'images', post.imageUrl), err => {
                if (err) {
                    const error = new Error('File was not deleted');
                    error.statusCode = 500;
                    throw error;
                }
            })

            return Post.findByIdAndDelete(postId);
        })
        .then(() => res.status(201).json({
            message: 'Post deleted successfully'
        }))
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}