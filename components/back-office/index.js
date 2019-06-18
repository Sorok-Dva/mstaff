const Configuration = require('./configuration/configuration.controller');
const Establishment = require('./establishment/establishment.controller');
const Group = require('./group/group.controller');
const SuperGroup = require('./supergroup/supergroup.controller');
const Impersonation = require('./user/impersonation.controller');
const Main = require('./back-office.controller');
const Reference = require('./references/reference.controller');
const User = require('./user/user.controller');

module.exports = {
  Configuration,
  Establishment,
  Group,
  SuperGroup,
  Impersonation,
  Main,
  Reference,
  User
};