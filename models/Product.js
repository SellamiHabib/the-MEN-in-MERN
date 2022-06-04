const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const productsDataFile = path.join(rootDir, 'data', 'allProducts.json');

const getAllDataFromFile = (callback) => {
    fs.readFile(productsDataFile, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(name, imageURL, description, price) {
        this.id = Math.floor(Math.random() * 1000).toString();
        this.name = name
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
        this.addProduct();
    }

    addProduct() {

        getAllDataFromFile(products => {
            products.push(this);
            fs.writeFile(productsDataFile, JSON.stringify(products, null, '\t'), (err, result) => {
                if (err) console.log(err.message);
            });
        })


    }

    static fetchAll(callback) {
        getAllDataFromFile(callback);
    }

    static fetchProductById(id, callback) {
        getAllDataFromFile(products => {
            const product = products.find(product => product.id === id);
            return callback(product);
        })
    }

    static updateProduct(id, name, imageURL, description, price) {
        Product.fetchAll(products => {
            const productIndex = products.findIndex(product => product.id === id);
            products[productIndex].name = name;
            products[productIndex].imageURL = imageURL;
            products[productIndex].description = description;
            products[productIndex].price = price;
            fs.writeFile(productsDataFile, JSON.stringify(products, null, '\t'), err => console.log(err));
        })
    }

    static deleteProduct(id) {
        Product.fetchAll(products => {
            const newProducts = products.filter((product) => product.id !== id)
            fs.writeFile(productsDataFile, JSON.stringify(newProducts, null, '\t'), err => console.log(err));
        })
    }
}