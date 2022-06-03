const express = require('express');

const Product = require('../models/Product');

module.exports.getAdminProductsPage = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/adminProducts', {
            title: 'Admin Products',
            path: '/admin/adminProducts',
            products: products,
        })
    })
}

module.exports.getAddProductPage = (req, res) => {
    res.render('admin/addProduct', {
        title: 'Add a product',
        path: '/admin/addProduct'
    })
}
module.exports.postAddProductPage = (req, res) => {
    const name = req.body['product-name'];
    const imageURL = req.body['product-imageURL'];
    const description = req.body['product-description'];
    const price = req.body['product-price'];
    new Product(name, imageURL, description, price);
    /*  the constructor handles saving the created product in a database(currently it's a json file),
                           so there's no need to assign the new object to a variable. */
    res.redirect('/admin/adminProducts');
}

module.exports.getEditProductPage = (req, res) => {
    res.render('admin/editProduct', {
        title: 'Edit the product',
        path: '/admin/editProduct'
    })
}

module.exports.postEditProductPage = (req, res) => {
    // edit logic
    res.redirect('/admin/adminProducts');
}
module.exports.postDeleteProductPage = (req, res) => {
    // delete logic
    res.redirect('/admin/adminProducts');
}