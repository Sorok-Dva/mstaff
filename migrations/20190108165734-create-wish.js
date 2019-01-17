'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Wishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Candidates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contract_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      posts: {
        type: Sequelize.JSON,
        allowNull: false
      },
      full_time: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      part_time: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      day_time: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      night_time: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      liberal_cabinets: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      availability: {
        type: Sequelize.JSON
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.STRING
      },
      lon: {
        type: Sequelize.STRING
      },
      geolocation: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      custom_address: {
        type: Sequelize.TEXT
      },
      es_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Wishes');
  }
};