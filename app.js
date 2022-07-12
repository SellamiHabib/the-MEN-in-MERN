const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

require('dotenv').config();

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use(flash());

const MONGODB_URI =process.env.MONGODB_URI
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;

    let errorMessage = req.flash('error');

    if (errorMessage !== undefined)
        res.locals.errorMessage = errorMessage[0];
    else
        res.locals.errorMessage = null;
    let successMessage = req.flash('success');
    if (successMessage[0] !== undefined) {
        res.locals.successMessage = successMessage[0];
    } else
        res.locals.successMessage = null;
    return next();
});



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, {useNewUrlParser: true})
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
