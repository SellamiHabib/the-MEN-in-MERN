const express = require('express');
const path = require('path');

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

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page)

app.listen(port);