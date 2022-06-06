const Product = require('../models/Product');
const Cart = require('../models/Cart');

module.exports.getShopPage = (req, res) => {
    Product.findAll()
        .then(products => {
            if (products.length === 0) {
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
    Product.findAll()
        .then(products => {
            res.render('shop/listProducts', {
                products: products,
                title: 'List of products',
                path: '/products'
            })
        })
}
module.exports.getProductDetailsPage = (req, res) => {
    const productID = req.params.id;
    Product.findByPk(productID)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('shop/productDetails', {
                title: product.title,
                path: '/products',
                product: product,
            });
        })
        .catch(err => console.log(err))
    ;
}
module.exports.getCartPage = (req, res) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/cart', {
                title: 'cart',
                path: '/cart',
                cart: products,
            })
        })
        .catch(err => console.log(err));
}
module.exports.postAddToCartPage = (req, res) => {
    const productID = req.body.productID;
    let fetchedCart;
    let quantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return fetchedCart.getProducts({where: {id: productID}})
        })
        .then(cartProduct => {
            cartProduct = cartProduct[0];
            if (cartProduct)
                quantity = cartProduct.Cart_Product.qty + 1;
            return Product.findByPk(productID);
        })
        .then(fetchedProduct => {
            return fetchedCart.addProduct(fetchedProduct, {through: {qty: quantity}});
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
}
module.exports.postDeleteCartProduct = (req, res) => {
    const id = req.body.productID;
    let fetchedCart;
    req.user.getCart()
        .then(cart => cart.getProducts({where: {id: id}}))
        .then(product => {
            product = product[0];
            product.Cart_Product.destroy();
        })
    res.redirect('/cart');
}
module.exports.getOrdersPage = (req, res) => {
    const cartID = req.body.cartID;
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders
            })
        })
}
module.exports.postOrdersPage = (req, res) => {
    const cartID = req.body.cartID;
    let fetchedCart;
    let cartProducts;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            cartProducts = products;
            return req.user.createOrder({price: 0});
        })
        .then(order => {
            return order.addProducts(cartProducts.map(product => {
                product.order_product = {qty: product.Cart_Product.qty}
                return product;
            }))
        })
        .then(() => res.redirect('/orders'))
        .catch(err => console.log(err))
}
/*
module.exports.getCheckoutPage = (req, res) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout',
        // cart: cart,
    })
}*/
