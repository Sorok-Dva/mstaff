const __ = process.cwd();
const { BackError } = require(`${__}/helpers/back.error`);
const { Op } = require('sequelize');
const _ = require('lodash');
const Models = require(`${__}/orm/models/index`);

module.exports = {
  verifyMaintenance: callback => {
    Models.ServerParameter.findOne({ where: { param: 'maintenance' } }).then(param => {
      if (_.isNil(param)) return callback('live');
      if (_.isNil(param.value)) return callback('live');
      return callback(param.value);
    });
  }
};