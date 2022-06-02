const express = require('express');
const routes = express.Router();
const path = require('path');
const rootDir = require('../util/path');

const products = [];

// /admin/
routes.get('/add-product', (req, res, next) => {
    res.render('addProduct', {
        title : 'Add a product',
        path: '/admin/add-product'
    })
});

routes.post('/add-product', (req, res, next) => {
    products.push({
        'name': req.body['product-name']
    })
    res.redirect('/');
});

exports.routes = routes;
exports.data = products;