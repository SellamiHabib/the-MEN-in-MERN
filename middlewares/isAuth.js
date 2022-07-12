const statusCodes = require('http-status-codes');

module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.flash('error', 'You need to be logged in to access the page');
        return res
            .send(statusCodes.UNAUTHORIZED) // 401
            .redirect('/login');
    }
    next();
}