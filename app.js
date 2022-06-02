const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const userRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}))


app.use('/admin', admin.routes);
app.use(userRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        title: "Woops",
        path:''
    });
})
app.listen(port);