const {body} = require('express-validator');

exports.addPostValidator = [
    body('title','Invalid title')
        .isString()
        .trim()
        .isLength({min: 5}),
    body('content','Invalid description content')
        .isString()
        .trim()
        .isLength({min: 5})
]