const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');

module.exports.getAdminProductsPage = (req, res) => {
    Product
        .find()
        .then(products => {
            res.render('admin/adminProducts', {
                title: 'Admin Products',
                path: '/admin/adminProducts',
                products: products,
                isAuthenticated: req.session.isAuthenticated
            })
        })
        .catch(err => console.log(err))
}
module.exports.getAddProductPage = (req, res) => {
    res.render('admin/addProduct', {
        title: 'Add a product',
        path: '/admin/addProduct',
        isAuthenticated: req.session.isAuthenticated
    })
}
module.exports.postAddProductPage = (req, res) => {
    const name = req.body['product-name'];
    const imageURL = req.body['product-imageURL'];
    const description = req.body['product-description'];
    const price = req.body['product-price'];

    const product = new Product({
        name: name,
        imageURL: imageURL,
        description: description,
        price: price,
        creatorUserID: req.user._id
    });
    product
        .save()
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err))

}

module.exports.getEditProductPage = (req, res) => {
    const productID = req.query.id;
    Product.findById(productID)
        .then(product => {
            res.render('admin/editProduct', {
                title: product.name,
                path: '/admin/editProduct',
                product: product,
                isAuthenticated: req.session.isAuthenticated
            })
        })
        .catch(err => console.log(err))
}

module.exports.postEditProductPage = (req, res) => {
    const id = req.body['id'];
    const name = req.body['product-name'];
    const imageURL = req.body['product-imageURL'];
    const description = req.body['product-description'];
    const price = req.body['product-price'];

    Product.findByIdAndUpdate(id, {name: name, imageURL: imageURL, description: description, price: price})
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err))
}

module.exports.postDeleteProductPage = (req, res) => {
    const id = req.body['productID'];
    Product.findByIdAndRemove(id)
        .then(() => User.findByIdAndRemove(id))
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err))

}
