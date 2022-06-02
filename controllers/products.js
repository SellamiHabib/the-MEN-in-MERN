const Product = require('../models/Product');

module.exports.getAddProductPage = (req, res) => {
    res.render('addProduct', {
        title: 'Add a product',
        path: '/admin/add-product'
    })
}

module.exports.postAddProductPage = (req, res) => {
    const name = req.body['product-name'];
    new Product(name); /*  the constructor handles saving the created product in a database(currently it's a json file), 
                        so there's no need to assign the new object to a variable. */
    res.redirect('/');
}

module.exports.getShopPage = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            products: products,
            title: "Product List",
            path: '/'
        })
    });
}