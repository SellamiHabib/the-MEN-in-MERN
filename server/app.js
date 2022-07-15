const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feedRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.static('images'));

app.use((req, res, next) => {
    res
        .setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
})

app.use('/feed', feedRoutes);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});