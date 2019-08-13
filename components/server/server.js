const __ = process.cwd();
const _ = require('lodash');
const Models = require(`${__}/orm/models/index`);

const Server = {};

Server.verifyMaintenance = callback => {
  Models.ServerParameter.findOne({ where: { param: 'maintenance' } }).then(param => {
    if (_.isNil(param)) return callback('live');
    if (_.isNil(param.value)) return callback('live');
    return callback(param.value);
  });
};

module.exports = Server;