'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserPools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pool_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pools',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      availability: {
        type: Sequelize.JSON,
        get() {
          let availability = this.getDataValue('availability') === undefined ? '{}' : this.getDataValue('availability');
          return JSON.parse(availability);
        },
        set(data) {
          this.setDataValue('availability', JSON.stringify(data));
        },
      },
      post: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service: {
        type: Sequelize.JSON,
        get() {
          let service = this.getDataValue('service') === undefined ? '{}' : this.getDataValue('service');
          return JSON.parse(service);
        },
        set(data) {
          this.setDataValue('service', JSON.stringify(data));
        },
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      month_experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      planning: {
        type: Sequelize.JSON,
        allowNull: true,
        get() {
          let planning = this.getDataValue('planning') === undefined ? '{}' : this.getDataValue('planning');
          return JSON.parse(planning);
        },
        set(data) {
          this.setDataValue('planning', JSON.stringify(data));
        },
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
    return queryInterface.dropTable('UserPools');
  }
};