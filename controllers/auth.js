const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport");
const crypto = require('node:crypto');
const {body, validationResult} = require("express-validator/check");
const statusCodes = require('http-status-codes');

const mailgunAuth = {
    auth: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    },
}

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
const sendEmail = (to, subject, htmlToSend) => {

    const mailOptions = {
        from: "Support@learning-express-test.com",
        to: to,
        subject: subject,
        name: 'Learning-Express',
        html: htmlToSend
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error)
            console.log(error);
    });
}

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        oldValues: {
            email: "",
            password: "",
        },
        errors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            oldValues: {
                email: email,
                password: password,
            },
            errors: errors.array()
        });
    }
    req.session.isLoggedIn = true;
    return res.redirect('/');
};

exports.getSignup = (req, res, next) => {

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        oldValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        errors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(statusCodes.UNPROCESSABLE_ENTITY) //http 422
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                oldValues: {
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                },
                errors: errors.array()
            })
    }
    const htmlToSend = `
                        <h1>You successfully created an account in your website, hurray!</h1>
                        <p>Your password is : ${password}</p>
                        `
    const mailOptions = {
        from: "test@learning-express-test.com",
        to: "hbib.sellami7@gmail.com",
        subject: "Account cedentials",
        text: 'and easy to do anywhere, even with Node.js',
        html: htmlToSend
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error)
            console.log(error);
    })

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newUser = new User({email: email, password: hashedPassword, cart: {items: []}});
            return newUser.save();
        })
        .then(() => {
            res.redirect('/');
        })
};


exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errors: [],
        oldValues: {
            email: ""
        }
    })
}
exports.postReset = (req, res, next) => {
    const email = req.body.email;
    let token = "";
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(statusCodes.BAD_REQUEST)
            .render('auth/reset', {
                path: '/reset',
                pageTitle: 'Reset Password',
                errors: errors.array(),
                oldValues: email
            });
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        token = buffer.toString('hex');
    })
    User.findOne({email: email})
        .then(user => {
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user
                .save()
                .then(() => {
                        const htmlToSend = `
                <h1>You requested a password reset</h1>
                <p>Someone requested a password reset for this email for your account on localhost:3000(cool website right?)</p>
                 <br>
                 <p>If it was you, visit this <a href=http://localhost:3000/reset/${token}> link</a>
                 to reset it.</p>
                 <br>
                 <p>If it wasn't you however, you should panic.</p>
                 <br>
                 <p>localhost:3000 Services.</p>
                `
                        sendEmail(email, 'Password reset token', htmlToSend);
                        req.flash('success', 'We sent you a reset email, please check your email');
                        res.redirect('/login');
                    }
                )
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err));
}
exports.getNewPasswordReset = (req, res, next) => {
    const token = req.params.token;
    return res.render('auth/newPasswordReset.ejs', {
        path: '/reset',
        pageTitle: 'Enter your new password',
        token: token,
        errors: []
    })
}
exports.postNewPasswordReset = (req, res, next) => {

    const token = req.token;
    const newPassword = req.newPassword;
    const resetUser = req.user;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(statusCodes.BAD_REQUEST)
            .render('auth/newPasswordReset', {
                path: '/new-password',
                pageTitle: 'Reset Password',
                token:token,
                errors: errors.array(),
                oldValues: {
                    email: ""
                }
            });
    }

    return bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            req.flash('success', 'Your password has successfully been changed, please login.');
            return resetUser.save();
        })
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err))
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
