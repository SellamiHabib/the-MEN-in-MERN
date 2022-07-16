const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const feedRoutes = require('./routes/feedRoutes');
const multer = require("multer");

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    next();
})
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else
        cb(null, false);
}


app.use(
    multer({
        storage: storage,
        fileFilter: fileFilter
    }).single('image'));


app.use('/feed', feedRoutes);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    res.status(status)
        .json({
            message: error.message
        })
})

mongoose.connect('mongodb://localhost:27017/test')
    .then(() => {
        console.log('Connected to the database')
    })
    .catch(err => console.log(err))

app.listen(5000, () => {
    console.log('Listening on port 5000');
});