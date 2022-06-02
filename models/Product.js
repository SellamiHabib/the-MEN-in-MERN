const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const dataFilePath = path.join(rootDir, 'data', 'allProducts.json');

const getAllDataFromFile = (callback) => {
    fs.readFile(dataFilePath, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {

    constructor(title) {
        this.title = title;
        this.addProduct()
    }

    addProduct() {

        getAllDataFromFile(products => {
            products.push(this);
            fs.writeFile(dataFilePath, JSON.stringify(products), (err, result) => {
                if (err) console.log(err.message);
            });
        })


    }
    static fetchAll(callback) {
        getAllDataFromFile(callback);
    }
}