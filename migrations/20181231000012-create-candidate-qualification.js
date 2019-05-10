'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CandidateQualifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Candidates',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        allowNull: false
      },
      name: {
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CandidateQualifications');
  }
};