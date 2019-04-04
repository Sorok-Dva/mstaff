'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ConfigSkills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_skill: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Skills',
          key: 'id'
        },
        allowNull: false
      },
      id_post: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'id'
        },
        allowNull: false
      },
      id_service: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Services',
          key: 'id'
        }
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
    return queryInterface.dropTable('ConfigSkills');
  }
};