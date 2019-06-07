module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Groups',
      'domain_name',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Groups',
      'domain_name'
    );
  }
};