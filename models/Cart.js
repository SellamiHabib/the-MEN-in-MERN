const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = require('../models/User');

const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

module.exports = Cart;
