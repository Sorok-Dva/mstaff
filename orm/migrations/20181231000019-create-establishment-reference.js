'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EstablishmentReferences', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
      },
      finess_et: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true //Cause it's a string he has to be unique (no primarykey allowed)
      },
      finess_ej: {
        type: Sequelize.STRING,
      },
      name_long: {
        type: Sequelize.STRING,
      },
      name_info: {
        type: Sequelize.STRING,
      },
      address_num: {
        type: Sequelize.STRING,
      },
      address_type: {
        type: Sequelize.STRING,
      },
      address_name: {
        type: Sequelize.STRING,
      },
      address_more: {
        type: Sequelize.STRING,
      },
      address_bp: {
        type: Sequelize.STRING,
      },
      address_code: {
        type: Sequelize.STRING,
      },
      address_dpt: {
        type: Sequelize.STRING,
      },
      address_dpt_name: {
        type: Sequelize.STRING,
      },
      address_town: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      category_name: {
        type: Sequelize.STRING,
      },
      cat: {
        type: Sequelize.STRING,
      },
      cat_bis: {
        type: Sequelize.STRING,
      },
      siret: {
        type: Sequelize.STRING,
      },
      code_ape: {
        type: Sequelize.STRING,
      },
      code_mft: {
        type: Sequelize.STRING,
      },
      name_mft: {
        type: Sequelize.STRING,
      },
      code_sph: {
        type: Sequelize.STRING,
      },
      name_sph: {
        type: Sequelize.STRING,
      },
      open_date: {
        type: Sequelize.STRING,
      },
      allow_date: {
        type: Sequelize.STRING,
      },
      update_date: {
        type: Sequelize.STRING,
      },
      num_ec: {
        type: Sequelize.STRING,
      },
      y: {
        type: Sequelize.STRING,
      },
      x: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.STRING,
      },
      lon: {
        type: Sequelize.STRING,
      },
      es_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('EstablishmentReferences');
  }
};