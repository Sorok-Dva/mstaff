const Sequelize = require('sequelize');
const conf = require('dotenv').config().parsed;
const env = conf.ENV;
const config = require(`../orm/config/config.json`)[env];

module.exports = new Sequelize(
  config.database, config.username, config.password, config
);