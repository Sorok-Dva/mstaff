const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Env } = require(`../../helpers/helpers`);
const basename = path.basename(module.filename);
const config = require(`${__dirname}/../config/config.json`)[Env.current];
// eslint-disable-next-line no-console
config.logging = config.logging ? console.log : null;
config.pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;