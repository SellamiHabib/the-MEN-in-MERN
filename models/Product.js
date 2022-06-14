const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class Product {
    constructor(name, imageURL, description, price) {
        this.name = name
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
        this.saveProduct();
    }

    saveProduct() {
        const db = getDb();
        db.collection('products').insertOne(this)
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
    }

    static fetchProductById(id) {
        const db = getDb();
        return db.collection('products')
            .findOne({_id: new mongodb.ObjectId(id)});
    }

    static updateProduct(id, name, imageURL, description, price) {
        const db = getDb();
        return db.collection('products')
            .updateOne({_id: new mongodb.ObjectId(id)}, {
                $set: {
                    name: name,
                    imageURL: imageURL,
                    description: description,
                    price: price
                }
            })
    }

    static deleteProduct(id) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
    }

}