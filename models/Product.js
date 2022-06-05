const db = require('../util/database');

module.exports = class Product {
    constructor(name, imageURL, description, price) {
        this.id = Math.floor(Math.random() * 1000).toString();
        this.name = name
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
        this.addProduct().then().catch(err => console.log(err));
    }

    addProduct() {
        return db.execute('INSERT INTO product(name,imageURL,price,description) VALUES(?, ?, ?, ?)',
            [this.name, this.imageURL, this.description, this.price])
    }

    static fetchAll() {
        return db.execute('SELECT * FROM product');
    }

    static fetchProductById(id) {
        return db.execute(
            'SELECT * from product p ' +
            'WHERE (p.id = ?)', [id]);
    }

    static updateProduct(id, name, imageURL, description, price) {
    }

    static deleteProduct(id) {

    }
}