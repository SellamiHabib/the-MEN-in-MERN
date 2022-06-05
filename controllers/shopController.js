const Product = require('../models/Product');
const Cart = require('../models/Cart');

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

module.exports.getProductDetailsPage = (req, res) => {
    const productID = req.params.id;

    Product.fetchProductById(productID, product => {
        if (!product) {
            res.redirect('/');
        }
        res.render('shop/productDetails', {
            title: product.title,
            path: '/products',
            product: product,
        });
    });

}
module.exports.getCartPage = (req, res) => {
    Cart.fetchAllCartItems(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            if (cart.products) {
                for (let product of products) {
                    const cartProductData = cart.products.find(prod => prod.id === product.id);
                    if (cartProductData) {
                        cartProducts.push({productData: product, qty: cartProductData.qty})
                    }
                }
            }
            res.render('shop/cart', {
                title: 'cart',
                path: '/cart',
                cart: cartProducts,
            })
        })

    })
}
module.exports.postAddToCartPage = (req, res) => {
    const productID = req.body.productID;
    const price = req.body.price;
    Cart.addProduct(productID, price);
    res.redirect('/');

}
module.exports.postDeleteCartProduct = (req, res) => {
    const id = req.body.productID;
    Cart.deleteCartItem(id);
    res.redirect('/cart');

}
module.exports.getCheckoutPage = (req, res) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout',
        // cart: cart,
    })
}