const statusCodes = require('http-status-codes');

exports.get404 = (req, res, next) => {
    res.status(statusCodes.NOT_FOUND)
        .render('errors/404', {
        pageTitle: 'Page Not Found',
        path: '/404'
    });
}
exports.get500 = (error, req, res, next) => {
    console.log(error);

    res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .render('errors/500', {
            pageTitle: 'Page Not Found',
            path: '/500'
        });
}
