'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Conferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      need_id: {
        type: Sequelize.INTEGER,
        allowNulL: false,
        references: {
          model: 'Needs',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNulL: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Candidates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM,
        values: ['online', 'physical']
      },
      date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['waiting', 'accepted', 'refused', 'expired']
      },
      key: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('Conferences');
  }
};