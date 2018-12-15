'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Candidates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      es_id: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      photo: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    return queryInterface.dropTable('Candidates');
  }
};