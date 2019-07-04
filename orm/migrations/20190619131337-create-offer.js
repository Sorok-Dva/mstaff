'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNulL: false,
        references: {
          model: 'Users',
          key: 'id'
        }
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
        allowNull: false,
        references: {
          model: 'Needs',
          key: 'id'
        },
      },
      nature_section: {
        type: Sequelize.JSON
      },
      context_section: {
        type: Sequelize.JSON
      },
      details_section: {
        type: Sequelize.JSON
      },
      postDescription_section: {
        type: Sequelize.JSON
      },
      prerequisites_section: {
        type: Sequelize.JSON
      },
      terms_sections: {
        type: Sequelize.JSON
      },
      status: {
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
    return queryInterface.dropTable('Offers');
  }
};