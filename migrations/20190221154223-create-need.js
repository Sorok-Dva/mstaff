'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Needs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      es_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Establishments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNulL: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      post: {
        type: Sequelize.STRING
      },
      contractType: {
        type: Sequelize.STRING
      },
      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('Needs');
  }
};