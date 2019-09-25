const Establishment = require('./establishment/establishment.controller');
const Group = require('./group/group.controller');
const SuperGroup = require('./supergroup/supergroup.controller');
const Main = require('./subdomain.controller');

module.exports = {
  Establishment,
  Group,
  SuperGroup,
  Main
};