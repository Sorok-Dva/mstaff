'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.addColumn('UserPools', 'inEs', { type: Sequelize.BOOLEAN, defaultValue: false, after: 'service' });
  },

  down: (queryInterface, Sequelize) => {
  }
};