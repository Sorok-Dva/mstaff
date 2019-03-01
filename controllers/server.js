const Models = require('../models/index');

module.exports = {
  verifyMaintenance: callback => {
    // @todo create server table and take value from it
    return callback('live');
  }
};