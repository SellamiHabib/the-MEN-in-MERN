const express = require('express');
const path = require('path');
const sequelize = require('./util/database');

const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');

const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Cart_Product = require('./models/Cart-Product');
const Order = require('./models/Order');
const Order_Product = require('./models/Order-Product');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}))
/*                  DATABASE ASSOCIATIONS                   */
User.hasOne(Cart, {constraints: true, onDelete: "CASCADE"});

Cart.belongsToMany(Product, {through: Cart_Product});
Product.belongsToMany(Cart, {through: Cart_Product});

User.hasMany(Order);
Order.hasOne(User, {constraints: true, onDelete: "CASCADE"})

Order.belongsToMany(Product, {through: Order_Product});
Product.belongsToMany(Order, {through: Order_Product});
/*                  PASSING A DUMMY USER TO ALL REQUESTS                   */

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

/*                  ROUTES                  */

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page)


/*USE {force: true} ONLY WHEN ADDING MAJOR CHANGES TO THE DATABASE AS IT
OVERWRITES IT ALL*/
//sequelize.sync({force: true})
sequelize.sync()
    .then(result => User.findByPk(1))
    .then(user => {
        if (!user) {
            return User.create({name: 'Habib', email: 'test@test.com'});
        }
        return user;
    })
    .then(user => user.createCart())
    .then(() => app.listen(3000))
    .catch(err => console.log(err));

