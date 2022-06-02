const express = require('express');

const router = express.Router();

const path = require('path');

const rootDir = require('../util/path');

const admin = require('./admin');

const products = admin.data;

router.get('/', (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', {
        products: products,
        title: "Product List",
        path: '/'
    });
})

module.exports = router;