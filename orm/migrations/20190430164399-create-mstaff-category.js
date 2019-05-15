'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MstaffCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
      },
      medical: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      paramedical: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      admin_and_tech: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      liberal: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      cdi_cdd: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      vacation: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      internship: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      service: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MstaffCategories');
  }
};