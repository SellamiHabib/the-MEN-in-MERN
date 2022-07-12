const {body} = require("express-validator/check");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.signUpValidator = [
    body('email', 'Please enter a valid email.')
        .isEmail()
        .custom(email => {
            return User.findOne({email: email})
                .then(user => {
                    if (user) {
                        return Promise.reject('The email you provided already exists');
                    }
                })
        }),
    body('password', 'Please enter a password with more than 3 characters')
        .isLength({min: 3})
        .isAlphanumeric(),
    body('confirmPassword')
        .custom((confirmPassword, {req}) => {
            if (confirmPassword !== req.body.password)
                throw new Error('The password you entered dont match');
            else
                return true
        })]

exports.loginValidator = [
    body('email', 'Please enter a valid email')
        .isEmail()
        .custom((value, {req}) => {

            return User
                .findOne({email: value})
                .then(user => {

                    if (!user)
                        return Promise.reject('Please verify your email and password and try again.');
                    return bcrypt
                        .compare(req.body.password, user.password)
                        .then(isMatched => {
                            if (!isMatched)
                                return Promise.reject('Please verify your email and password and try again.');
                            else {
                                req.session.user = user;
                                req.session.save();
                            }
                        })
                })
        })
]

exports.resetValidator = [
    body('email', 'The email you entered is invalid')
        .isEmail()
        .custom((value, {req}) => {
            return User
                .findOne({email: value})
                .then(user => {
                    if (!user) {
                        return Promise.reject('The email you entered doesn\'t have an account');
                    }

                })
        })
]

exports.newPasswordResetValidator = [
    body('password', 'the password you entered has to have more than 3 characters')
        .isLength({min: 3})
        .custom((inputPassword, {req}) => {
            return User.findOne({resetToken: req.body.token, resetTokenExpiration: {$gt: Date.now()}})
                .then(user => {
                    if (!user) {
                        return Promise.reject('The link you entered is invalid or expired');
                    }
                    req.newPassword = inputPassword;
                    req.token = req.body.token;
                    req.user = user;
                })
        })
]