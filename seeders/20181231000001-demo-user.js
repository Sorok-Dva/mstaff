'use strict';

const _ = require('lodash');

let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let firstNames = ['John', 'Lisa', 'Lucas', 'Maelis', 'Laura', 'Baptiste', 'William', 'Benjamin', 'Pauline', 'Charline', 'Anita', 'Marie'];
let lastNames = ['Doe', 'Dupont', 'Laporte', 'Boulanger', 'Saurin', 'Lepetit', 'Legrand', 'Curie', 'Jaipadydai', 'Ifaibo'];

module.exports = {
  up: (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 0; i < 25; i++) {
      records.push({
        firstName: _.sample(firstNames),
        lastName: _.sample(lastNames),
        email: `seeder-${i}@demo.com`,
        password: 'passwordBidon',
        birthday: new Date(rand(1950, 2001), rand(1, 12), rand(1, 30)),
        postal_code: '75000',
        town: 'PARIS',
        phone: `+33700${Math.floor(Math.random() * 999999) + 100000  }`,
        role: 'User',
        type: 'candidate'
      });
    }
    return queryInterface.bulkInsert('Users', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};