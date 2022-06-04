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
    constructor(title, imageURL, description, price) {
        this.id = Math.floor(Math.random() * 1000).toString();
        this.title = title;
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
}