const fs = require('fs');
const path = require('path');
const Post = require('../models/post')
const User = require('../models/user');
const {validationResult} = require('express-validator');

module.exports.getPosts = async (req, res, next) => {
    try {
        let posts = await Post.find().populate('creator', 'name');
        if (!posts) {
            posts = [];
        }
        res.status(200)
            .json({
                posts: posts,
                message: "Posts fetched successfully"
            })
    } catch (error) {
        if (!error.statusCode)
            error.statusCode = 500;
        next(error);
    }
}

module.exports.postAddPost = async (req, res, next) => {
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
        imageUrl: imageUrl,
        creator: req.userId,
        author: "Habib",
    })
    try {
        await post.save();
        let user = await User.findById(req.userId);
        user.posts.push(post);
        await user.save();
        return res.status(201)
            .json({
                post: post,
                creator: {
                    _id: user.userId,
                    name: user.name
                }
            })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}
module.exports.getOnePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        let post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }
        return res.status(200)
            .json({
                post: post
            })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}
module.exports.editPost = async (req, res, next) => {
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
    try {
        let post = await Post.findById(postId)
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
        await post.save();
        return res;
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}
module.exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        let post = await Post.findById(postId)
        fs.unlink(path.join(__dirname, '..', 'images', post.imageUrl), err => {
            if (err) {
                const error = new Error('File was not deleted');
                error.statusCode = 500;
                throw error;
            }
        })
        await Post.findByIdAndDelete(postId);
        return res.status(201).json({
            message: 'Post deleted successfully'
        })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}