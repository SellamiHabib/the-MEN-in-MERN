const express = require('express');
const path = require('path');
const MongoConnect = require('./util/database').MongoConnect;
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
    User.findById('62a8fb2a8ac84a6cc3f639c2')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page)

MongoConnect
    .then(() => {
        app.listen(port);
        console.log("Server started!");
    })


