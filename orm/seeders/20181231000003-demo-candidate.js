'use strict';

let candidates = [
  { user_id: 1, description: 'Admin' },
  { user_id: 2, description: 'Llyam Garcia' },
  { user_id: 3, description: 'Romain Piccolo' }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    let records = [];

    candidates.forEach((candidate) => {
      records.push(candidate);
    });

    return queryInterface.bulkInsert('Candidates', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Candidates', null, {});
  }
};
