const Sequelize = require('sequelize');
const conf = require('dotenv').config().parsed;
const env = conf.ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];

module.exports = new Sequelize(
  config.database, config.username, config.password, config
);