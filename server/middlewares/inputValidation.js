const {body} = require('express-validator');
const User = require('../models/user');

exports.addPostValidator = [
    body('title', 'Invalid title')
        .isString()
        .trim()
        .isLength({min: 5}),
    body('content', 'Invalid description content')
        .isString()
        .trim()
        .isLength({min: 5})
]
exports.signupValidator = [
    body('email')
        .isEmail()
        .custom(email => {
            return User
                .findOne({email: email})
                .then(user => {
                    if (user) {
                        return Promise.reject('The email you entered is already used.')
                    }

                })
        }),
    body('password', 'Please enter a valid password')
        .isString()
        .isLength({min: 3}),
    body('name', 'Please enter a valid name')
        .isString()
        .isAlpha()
        .isLength({min: 4})
]