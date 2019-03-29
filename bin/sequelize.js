const Sequelize = require('sequelize');
const { Env } = require('../helpers/helpers');
const config = require(`${__dirname}/../orm/config/config.json`)[Env.current];

module.exports = new Sequelize(
  config.database, config.username, config.password, config
);