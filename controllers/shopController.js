const Product = require('../models/Product');
const User = require('../models/User');

module.exports.getShopPage = (req, res) => {
    Product.find()
        .then(products => {
            if (products.length === 0) {
                return res.render('404', {
                    title: "No products found",
                    path: '/',
                    isAuthenticated: req.session.isAuthenticated
                });
            }
            res.render('shop/index', {
                products: products,
                title: "Product List",
                path: '/',
                isAuthenticated: req.session.isAuthenticated
            })
        })
        .catch(err => console.log(err))
}

module.exports.getProductsPage = (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/listProducts', {
                products: products,
                title: 'List of products',
                path: '/products',
                isAuthenticated:req.session.isAuthenticated
            })
        })
        .catch(err => console.log(err))
}

module.exports.getProductDetailsPage = (req, res) => {
    const productID = req.params.id;
    console.log(req.params)
    Product.findById(productID)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            return res.render('shop/productDetails', {
                title: product.name,
                path: '/products',
                product: product,
                isAuthenticated:req.session.isAuthenticated
            });
        })
        .catch(err => console.log(err))
}

module.exports.getCartPage = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const cartProducts = user.cart.items
            res.render('shop/cart', {
                title: 'cart',
                path: '/cart',
                cart: cartProducts,
                isAuthenticated:req.session.isAuthenticated
            })
        })
        .catch(err => console.log(err));
}

module.exports.postAddToCartPage = (req, res) => {
    const productID = req.body.productID;
    Product
        .findById(productID)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));

}
module.exports.postDeleteCartProduct = (req, res) => {
    const id = req.body.productID;
    req.user
        .deleteCartItem(id)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));

}