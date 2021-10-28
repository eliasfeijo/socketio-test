const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/user');

console.log('dbConfig:', dbConfig);

const connection = new Sequelize(dbConfig);

User(connection);

module.exports = connection;