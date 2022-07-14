const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const PDFDocument = require('pdfkit');
const axios = require('axios').default;
const crypto = require('node:crypto');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}};
            });
            const order = new Order({
                user: {
                    name: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};
exports.getInvoice = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
        return next(new Error('Requested page is not valid'));
    }
    const invoiceId = mongoose.Types.ObjectId(req.params.orderId);
    const invoiceName = "invoice - " + invoiceId + ".pdf";
    const invoicePath = path.join('data', 'invoices', invoiceName);

    Order.findOne({'user.userId': req.user._id, _id: invoiceId})
        .then(order => {
            if (!order) {
                return next(new Error('Unauthorized'));
            }
            const invoicePdf = new PDFDocument();
            const file = fs.createWriteStream(invoicePath);
            invoicePdf.pipe(res);
            invoicePdf.pipe(file);
            invoicePdf
                .fontSize(24)
                .text("Invoice id : " + invoiceId, {underline: true})
            invoicePdf.text('-----------------------------');
            let totalPrice = 0;
            order.products.forEach(product => {
                invoicePdf
                    .fontSize(16)
                    .text(product.product.title + ' | ' + product.quantity + ' x ' + product.product.price);
                invoicePdf.text('--------------------');
                totalPrice += product.quantity * product.product.price;
            })
            invoicePdf
                .fontSize(24)
                .text('Total price: ' + totalPrice + '$');
            invoicePdf.end();
            return res
                .setHeader('Content-Type', 'application/pdf')
                .setHeader('Content-Disposition', 'inline')
                .setHeader('filename', invoiceName)
        })
        .catch(err => {
            return next(new Error(err));
        })

}
exports.getCheckout = (req, res, next) => {
    let orderId = req.params.orderId;
    let totalPrice = 0;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(new Error('Requested page is not valid'));
    }
    orderId = mongoose.Types.ObjectId(orderId);
    Order.findOne({'user.userId': req.user._id, _id: orderId})
        .then(order => {
            if (!order)
                return next(new Error('Unauthorized'));
            order.products.forEach(product => totalPrice += product.quantity * product.product.price);
            return Promise.resolve(totalPrice);
        })
        .then(totalPrice => {

            const paymentData = {
                "app_token": process.env.FLOUCI_PUBLIC_TOKEN,
                "app_secret": process.env.FLOUCI_SECRET_TOKEN,
                "amount": totalPrice * 1000, //millimes
                "accept_card": "true",
                "session_timeout_secs": 1200,
                "success_link": "http://localhost:3000/orders",
                "fail_link": "https://localhost:3000/500",
                "developer_tracking_id": 'cffbb74f-596b-407f-abc6-cfee93a331b0'
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            }
            axios.post('https://developers.flouci.com/api/generate_payment', paymentData, config)
                .then(result => {
                    res.redirect(result.data.result.link);
                })
                .catch(err => console.log(err))
        })

}