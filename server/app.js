const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('./utils/multer');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv').config();


const app = express();

app.use(express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');

    next();
})
app.use(bodyParser.json({limit: '10mb'}));
app.use(multer().single('image'));

app.use('/feed', feedRoutes);
app.use(authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const data = error.data;

    res.status(status)
        .json({
            message: error.message,
            data: data
        })
})

mongoose.connect('mongodb://localhost:27017/test')
    .then(() => {
        console.log('Connected to the database');
        app.listen(5000, () => {
            console.log('Listening on port 5000');
        });
    })
    .catch(err => console.log(err))

