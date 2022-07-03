const User = require("../models/User");
module.exports.getLoginPage = (req, res) => {
    return res.render('account/login.ejs', {
        title: "Login",
        path: '/login',
        isAuthenticated: false
    });
}

module.exports.postLoginPage = (req, res) => {
    req.session.isAuthenticated = true;
}
module.exports.postLogout = (req, res) => {
    req.session.destroy();
    req.session.save(() => {
        res.redirect('/');
    })

}