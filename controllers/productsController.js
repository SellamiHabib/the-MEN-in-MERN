const Product = require('../models/Product');

module.exports.getShopPage = (req, res) => {
    Product.fetchAll((products) => {
        if (products.length == 0) {
            return res.render('404', {
                title: "No products found",
                path: '/'
            });
        }
        res.render('shop/index', {
            products: products,
            title: "Product List",
            path: '/'
        })
    });
}

module.exports.getProductsPage = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/listProducts', {
            products: products,
            title: 'List of products',
            path: '/products'
        })
    })

}
module.exports.getCartPage = (req, res) => {
     res.render('shop/cart', {
         title: 'cart',
         path: '/cart',
        // cart: cart,
     })
}
module.exports.getCheckoutPage = (req, res) => {
     res.render('shop/checkout', {
         title: 'Checkout',
         path: '/checkout',
        // cart: cart,
     })
}