const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const MongoConnect = MongoClient.connect('mongodb+srv://MEN:KcGwAL4D8WThu57@cluster0.hiyii.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        _db = client.db();
        console.log("Connected to the database.")
        return new Promise((res, rej) => res());
    })
    .catch(err => console.log(err))
const getDb = () => {
    if (_db)
        return _db;
    throw "No database connected";
}
exports.MongoConnect = MongoConnect;
exports.getDb = getDb;