const Establishment = require('./establishment/establishment.controller');
const Main = require('./back-office.controller');
const Reference = require('./references/reference.controller');
const User = require('./user/user.controller');

module.exports = {
  Establishment,
  Main,
  Reference,
  User
};