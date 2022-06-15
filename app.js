const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const User = require('./models/User');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use((req, res, next) => {
    User.findById('62a9d7ca98b2ea640bc3da9e')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page)

mongoose
    .connect('mongodb+srv://MEN:KcGwAL4D8WThu57@cluster0.hiyii.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        User
            .findOne()
            .then((user) => {
                if (!user) {
                    const user = new User({
                        name : 'Habib',
                        email: 'Habib@test.com',
                        cart: {items:[]}
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


