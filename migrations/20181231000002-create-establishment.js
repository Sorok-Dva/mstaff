'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Establishments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      finess: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      finess_ej: {
        type: Sequelize.STRING,
        allowNull: false
      },
      siret: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      code: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      sector: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      town: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.STRING
      },
      domain_name: {
        type: Sequelize.STRING
      },
      domain_enable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      salaries_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      contact_identity: {
        type: Sequelize.STRING
      },
      contact_post: {
        type: Sequelize.STRING
      },
      contact_email: {
        type: Sequelize.STRING
      },
      contact_phone: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Establishments');
  }
};