'use strict';

let wishes = 	[
  {
    candidate_id: 3,
    name: 'CDI 2 services',
    contract_type: 'cdi-cdd',
    posts: '"[\\"Auxiliaire de Puériculture\\"]"',
    services: '"[\\"Anesthésiologie\\",\\"Andrologie\\"]"',
    full_time: 1,
    part_time: 1,
    day_time: 1,
    night_time: 0,
    liberal_cabinets: 0,
    availability: null,
    start: null,
    end: null,
    status: null,
    lat: '44.0147968',
    lon: '1.3582336',
    geolocation: 1,
    custom_address: null,
    es_count: 2,
  },
  {
    candidate_id: 3,
    name: 'VACATION no services',
    contract_type: 'vacation',
    posts: '"[\\"Infirmier Puériculteur\\"]"',
    services: null,
    full_time: 0,
    part_time: 0,
    day_time: 0,
    night_time: 0,
    liberal_cabinets: 0,
    availability: null,
    start: null,
    end: null,
    status: null,
    lat: '44.014777099999996',
    lon: '1.358428',
    geolocation: 1,
    custom_address: null,
    es_count: 1,
  },
  {
    candidate_id: 3,
    name: 'STAGE 1 service',
    contract_type: 'internship',
    posts: '"[\\"Aide soignant - ASD\\"]"',
    services: '"[\\"Bloc opératoire\\"]"',
    full_time: 0,
    part_time: 0,
    day_time: 0,
    night_time: 0,
    liberal_cabinets: 0,
    availability: null,
    start: '2019-03-02 11:04:56',
    end: '2019-03-22 11:05:56',
    status: null,
    lat: '44.0147656',
    lon: '1.3584266',
    geolocation: 1,
    custom_address: null,
    es_count: 1,
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    let records = [];

    wishes.forEach((wish) => {
      records.push(wish);
    });

    return queryInterface.bulkInsert('Wishes', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Wishes', null, {});
  }
};
