'use strict';

let applications = 	[
  {
    name: 'CDI 2 services',
    wish_id: 1,
    candidate_id: 3,
    es_id: null,
    ref_es_id: '820000040',
    percentage: null,
    accepted: null,
    status: null,
    type: null,
    new: 1,
    renewed: 1,
    last_renew: null,
  },
  {
    name: 'CDI 2 services',
    wish_id: 1,
    candidate_id: 3,
    es_id: null,
    ref_es_id: '820000065',
    percentage: null,
    accepted: null,
    status: null,
    type: null,
    new: 1,
    renewed: 1,
    last_renew: null,
  },
  {
    name: 'VACATION no services',
    wish_id: 2,
    candidate_id: 3,
    es_id: null,
    ref_es_id: '820000040',
    percentage: null,
    accepted: null,
    status: null,
    type: null,
    new: 1,
    renewed: 1,
    last_renew: null,
  },
  {
    name: 'STAGE 1 service',
    wish_id: 3,
    candidate_id: 3,
    es_id: null,
    ref_es_id: '820000040',
    percentage: null,
    accepted: null,
    status: null,
    type: null,
    new: 1,
    renewed: 1,
    last_renew: null,
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    let records = [];

    applications.forEach((application) => {
      records.push(application);
    });

    return queryInterface.bulkInsert('Applications', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Applications', null, {});
  }
};
