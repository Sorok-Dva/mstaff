'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Establishments', [{
      name: 'Santé pour tous',
      finess: '000420042',
      code: '12345',
      domain_name: 'sante',
      domain_enable: true
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Establishments', null, {});
  }
};
