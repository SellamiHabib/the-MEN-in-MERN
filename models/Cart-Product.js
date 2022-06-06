const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Cart_Product = sequelize.define('Cart_Product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    qty: Sequelize.INTEGER
})

module.exports = Cart_Product;
