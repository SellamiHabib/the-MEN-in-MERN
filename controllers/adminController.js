const express = require('express');

const Product = require('../models/Product');
const User = require('../models/User');

module.exports.getAdminProductsPage = (req, res) => {
    Product.findAll()
        .then(products => {
            res.render('admin/adminProducts', {
                title: 'Admin Products',
                path: '/admin/adminProducts',
                products: products,
            })
        })
        .catch(err => console.log(err))
}

module.exports.getAddProductPage = (req, res) => {
    console.log(req.User)
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

   Product.create(
        {
            name: name,
            imageURL: imageURL,
            description: description,
            price: price,
        })
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err));
}
module.exports.getEditProductPage = (req, res) => {
    const productID = req.query.id;
    Product.findByPk(productID)
        .then(product => {
            res.render('admin/editProduct', {
                title: product.name,
                path: '/admin/editProduct',
                product: product
            })
        })
        .catch(err => console.log(err));

}

module.exports.postEditProductPage = (req, res) => {
    const id = req.body['id'];
    const name = req.body['product-name'];
    const imageURL = req.body['product-imageURL'];
    const description = req.body['product-description'];
    const price = req.body['product-price'];
    Product.findByPk(id)
        .then(p => {
            p.name = name;
            p.imageURL = imageURL;
            p.description = description;
            p.price = price;
            return p.save();
        })
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err));
}

module.exports.postDeleteProductPage = (req, res) => {
    const id = req.body.productID;
    Product.findByPk(id)
        .then(p => {
            p.destroy()
                .then(() => {
                    res.redirect('/admin/adminProducts');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}
