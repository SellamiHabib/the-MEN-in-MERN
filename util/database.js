const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize('node-project', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false,
});
module.exports = sequelize;