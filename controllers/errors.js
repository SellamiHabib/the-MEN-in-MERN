module.exports.get404Page = (req, res, next) => {
    res.status(404).render('404', {
        title: "Woops",
        path: '',
        isAuthenticated: req.session.isAuthenticated
    });
}