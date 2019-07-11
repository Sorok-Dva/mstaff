const Configuration = require('./configuration/configuration.controller');
const Establishment = require('./establishment/establishment.controller');
const Group = require('./group/group.controller');
const Impersonation = require('./user/impersonation.controller');
const JobBoard = require('./job_board/job_board.controller');
const Main = require('./back-office.controller');
const Reference = require('./references/reference.controller');
const User = require('./user/user.controller');

module.exports = {
  Configuration,
  Establishment,
  Group,
  Impersonation,
  JobBoard,
  Main,
  Reference,
  User
};