const {validationResult} = require('express-validator');

module.exports.getPosts = (req, res, next) => {
    res
        .status(200)
        .json({
            posts: [
                {
                    _id: '1',
                    title: 'Dummy title',
                    author: 'Dummy auther',
                    imageUrl: 'Rabye.jpg',
                    content: 'Dummy content',
                    creator: {
                        name: "Habib"
                    },
                    createdAt: Date.now()
                }
            ]
        })
}

module.exports.postAddPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({
                message: 'Validaion failed',
                errors: errors.array()
            })
    }

    const post = {
        message: 'Successfully created the post',
        _id: '1',
        title: title,
        content: content,
        creator: "Habib",
        createdAt: Date.now()
    }
    res
        .status(201)
        .json({
            post: post
        })
}