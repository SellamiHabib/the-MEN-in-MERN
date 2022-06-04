const fs = require('fs');
const path = require('path');
const Product = require('./Product');

const rootDir = require('../util/path');
const cartDataFile = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {

    static addProduct(productID, price) {
        fs.readFile(cartDataFile, (err, contentFile) => {
            let cart = {
                products: [],
                price: 0
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
            const newPrice = cart.price += price;
            cart = {products: [...cartProducts], price: newPrice}

            fs.writeFile(cartDataFile, JSON.stringify(cart, null, '\t'), err => console.log(err));


        })


    }

}