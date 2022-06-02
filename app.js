const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
})
app.listen(port);