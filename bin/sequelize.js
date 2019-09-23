const Sequelize = require('sequelize');
const { Env } = require('../helpers/helpers');
const config = require(`${__dirname}/../orm/config/config.json`)[Env.current];

// eslint-disable-next-line no-console
config.logging = config.logging ? console.log : null;
config.pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};

module.exports = new Sequelize(
  config.database, config.username, config.password, config
);