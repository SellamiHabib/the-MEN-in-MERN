const {body} = require("express-validator/check");
const User = require("../models/user");

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
            .custom((confirmPassword,{req}) => {
                if (confirmPassword !== req.body.password)
                    throw new Error('The password you entered dont match');
                else
                    return true
            })]
