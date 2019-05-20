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
      oldId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      category: {
        type: Sequelize.STRING,
      },
      finess: {
        type: Sequelize.STRING,
        allowNull: false
      },
      finess_ej: {
        type: Sequelize.STRING,
      },
      siret: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        defaultValue: '/static/assets/images/default_hospital.jpg'
      },
      banner: {
        type: Sequelize.STRING,
        defaultValue: '/static/assets/images/cover-es.jpg'
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