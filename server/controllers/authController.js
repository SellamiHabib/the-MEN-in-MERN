const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.putSignUp = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newUser = new User(
                {
                    email: email,
                    password: hashedPassword,
                    name: name,
                    status: "I am new",
                })

            return newUser.save();
        })
        .then(user => {
            res.status(201)
                .json({
                    message: 'User created',
                    userId: user._id
                })
        })
        .catch(err => {

            if (!err.statusCode)
                err.statusCode = 500;
            const error = new Error('Could not create the account');
            next(error);
        })
}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const inputPassword = req.body.password;
    let fetchedUser;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('No account found with the entered email');
                error.statusCode = 401;
                throw error;
            }
            fetchedUser = user;
            bcrypt.compare(inputPassword, user.password)
                .then(isEqual => {
                    if (!isEqual) {
                        const error = new Error('The password you entered is wrong, please try again.');
                        error.statusCode = 401;
                        throw error;
                    }
                    const jwtToken = jwt.sign({
                            email: fetchedUser.email,
                            password: fetchedUser.password
                        },
                        process.env.TOKEN_SECRET,
                        {expiresIn: '1800s'});
                    return res.status(201)
                        .json({
                            token: jwtToken,
                            userId: user._id.toString()
                        })
                })
        })
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 500;
            const error = new Error(err.message);
            next(error);
        })
}





