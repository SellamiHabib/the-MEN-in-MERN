const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.addUser();
    }

    addUser() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this);
    }

    static findAll() {
        const db = getDb();
        return db.collection('users')
            .find()
            .toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({_id: new mongodb.ObjectId(id)});
    }
}

module.exports = User;