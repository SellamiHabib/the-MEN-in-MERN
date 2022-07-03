const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const User = require('./models/User');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;
const MongodbURI = 'mongodb+srv://MEN:KcGwAL4D8WThu57@cluster0.hiyii.mongodb.net/?retryWrites=true&w=majority';

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}))

const store = new MongoDBStore({
    uri: MongodbURI,
    collection: 'sessions'
});

app.use(
    session({secret: 'long string value', resave: false, saveUninitialized: false, store: store})
)
app.use((req, res, next) => {
    if (!req.session.user)
        next();
    else {
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.log(err))
    }
})
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(errorController.get404Page);

mongoose
    .connect(MongodbURI)
    .then(() => {
        User
            .findOne()
            .then((user) => {
                if (!user) {
                    const user = new User({
                        name: 'Habib',
                        email: 'Habib@test.com',
                        cart: {items: []}
                    })
                    return user.save();
                }
            })
            .catch(err => console.log(err));
    })
    .then(() => {
        app.listen(port);
        console.log("Server started!");
    })
    .catch(err => console.log(err));


