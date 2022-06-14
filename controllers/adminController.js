const express = require('express');
const Product = require('../models/Product');

module.exports.getAdminProductsPage = (req, res) => {
    Product.fetchAll()
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
    res.redirect('/admin/adminProducts');
}

module.exports.getEditProductPage = (req, res) => {
    const productID = req.query.id;
    Product.fetchProductById(productID)
        .then(product => {
            res.render('admin/editProduct', {
                title: product.name,
                path: '/admin/editProduct',
                product: product
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
    Product.updateProduct(id, name, imageURL, description, price)
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err))
}
module.exports.postDeleteProductPage = (req, res) => {
    const id = req.body['productID'];
    Product.deleteProduct(id)
        .then(() => res.redirect('/admin/adminProducts'))
        .catch(err => console.log(err))

}
