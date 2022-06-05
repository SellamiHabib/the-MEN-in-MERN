const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Product = require('./Product');

const cartDataFile = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(productID, price) {
        fs.readFile(cartDataFile, (err, contentFile) => {
            let cart = {
                products: [], price: 0
            };
            if (!err) {
                cart = JSON.parse(contentFile);
            }
            let cartProducts = cart.products;
            const existingProduct = cartProducts.find(product => product.id === productID);
            if (existingProduct) {
                existingProduct.qty++;
            } else {
                const newProduct = {id: productID, qty: 1}
                cartProducts.push(newProduct);
            }
            const newPrice = +cart.price + +price;
            cart = {products: [...cartProducts], price: newPrice}
            fs.writeFile(cartDataFile, JSON.stringify(cart, null, '\t'), err => console.log(err));
        })

    }

    static fetchAllCartItems(callback) {
        fs.readFile(cartDataFile, (err, fileContent) => {
            if (!err) {
                const cartProducts = JSON.parse(fileContent.toString());
                callback(cartProducts);
            } else {
                callback({});
            }
        })
    }

    static deleteCartItem(id) {
        let newCart = {};
        Cart.fetchAllCartItems(cart => {
            const productIndex = cart.products.findIndex(p => p.id === id);
            Product.fetchProductById(productID)
                .then(([product,metaData]) => {
                    product = product[0];
                    cart.products.splice(productIndex, 1);
                    cart.price = (+cart.price - +product.price * +cart.products.qty);
                    fs.writeFile(cartDataFile, JSON.stringify(cart, null, '\t'), err => console.log(err));
                })
                .catch(err => console.log(err));
        })
    }
}









