'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let Categories = ['none', 'medical_category', 'administrative_category' , 'mix_category'];
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
