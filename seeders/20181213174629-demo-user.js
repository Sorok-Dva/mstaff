'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo@demo.com',
      password: 'passwordBidon',
      birthday: new Date(1998, 7, 12),
      postal_code: '75000',
      town: 'PARIS',
      phone: '+33700004242',
      role: 'User',
      type: 'candidate'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};