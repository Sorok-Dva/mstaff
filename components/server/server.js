const Models = require('../../orm/models');

module.exports = {
  verifyMaintenance: callback => {
    // @todo create server table and take value from it
    return callback('live');
  }
};