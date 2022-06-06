const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order_Product = sequelize.define('order_product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    qty: Sequelize.INTEGER
})

module.exports = Order_Product;
