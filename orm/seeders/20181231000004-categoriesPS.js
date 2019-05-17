'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let Categories = ['none', 'medical_category', 'paramedical_category', 'administrative_technical_category', 'liberal_category', 'mix_category'];
    let records = [];

    Categories.forEach((cat) => {
      records.push({
        name: cat
      });
    });

    return queryInterface.bulkInsert('CategoriesPostsServices', records, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CategoriesPostsServices', null, {});
  }
};
