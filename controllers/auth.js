const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")
const crypto = require('node:crypto');

const mailgunAuth = {
    auth: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: "sandboxd19b940ccf964ad8a475037f17a28e04.mailgun.org"
    },
}

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
const sendEmail = (to, subject, htmlToSend) => {

    const mailOptions = {
        from: "test@learning-express-test.com",
        to: to,
        subject: subject,
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
    });
};

exports.getSignup = (req, res, next) => {

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Please verify your email and password and try again.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    if (!isMatched) {
                        req.flash('error', 'Please verify your email and password and try again.');
                        return res.redirect('/login');
                    }
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save(err => {
                        console.log(err);
                        return res.redirect('/');
                    });
                })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (user) {
                req.flash('error', 'The email you provided already exists, please login');
                return res.redirect('/login');
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
                .then(result => {
                    res.redirect('/');
                })
        })

};

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
    })
}
exports.postReset = (req, res, next) => {
    const email = req.body.email;
    let token = "";
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        token = buffer.toString('hex');
    })
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'The email you entered doesnt have an account');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
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

        })
        .catch(err => console.log(err));
}
exports.getNewPasswordReset = (req, res, next) => {
    const token = req.params.token;
    return res.render('auth/newPasswordReset.ejs', {
        path: '/reset',
        pageTitle: 'Enter your new password',
        token: token
    })
}
exports.postNewPasswordReset = (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                req.flash('error', 'The link you entered is invalid or expired');
                return res.redirect('/login');
            }
            let resetUser = user;
            bcrypt.hash(newPassword, 12)
                .then
                (hashedPassword => {
                        resetUser.password = hashedPassword;
                        resetUser.resetToken = undefined;
                        resetUser.resetTokenExpiration = undefined;
                        req.flash('success', 'Your password has successfully been changed, please login.');
                        return resetUser.save();
                    }
                );
        }).then(() => {
        res.redirect('/login');
    })
        .catch(err => console.log(err))
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
