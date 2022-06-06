const express = require('express');
const path = require('path');
const sequelize = require('./util/database');

const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');

const Product = require('./models/Product');
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}))

/*                    Routes                     */

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page)

User.hasMany(Product, {constraints: true, onDelete: 'CASCADE'});

sequelize.sync({force: true})
    .then(result => {
        app.listen(port);
    })
    .catch(err => console.log(err));

