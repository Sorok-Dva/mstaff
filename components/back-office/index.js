const Establishment = require('./establishment/establishment.controller');
const Group = require('./group/group.controller');
const Impersonation = require('./user/impersonation.controller');
const Main = require('./back-office.controller');
const Reference = require('./references/reference.controller');
const User = require('./user/user.controller');

module.exports = {
  Establishment,
  Group,
  Impersonation,
  Main,
  Reference,
  User
};