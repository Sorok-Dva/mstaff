'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint('EstablishmentGroups', 'EstablishmentGroups_ibfk_1', { transaction: t }),
        queryInterface.removeConstraint('EstablishmentGroups', 'EstablishmentGroups_ibfk_2', { transaction: t }),
        queryInterface.addConstraint('EstablishmentGroups', ['id_es'], {
          type: 'foreign key',
          name: 'EstablishmentGroups_ibfk_3',
          references: {
            table: 'Establishments',
            field: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction: t
        }),
        queryInterface.addConstraint('EstablishmentGroups', ['id_group'], {
          type: 'foreign key',
          name: 'EstablishmentGroups_ibfk_4',
          references: {
            table: 'Groups',
            field: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction: t
        }),
        queryInterface.bulkDelete('Establishments', {
          name: {
            [Op.or]: [{ [Op.like]: '%CROIX-ROUGE%' }, { [Op.like]: '%CROIX ROUGE%' }]

          } }, { transaction: t }),
        queryInterface.addColumn('Establishments', 'structure_number', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('Establishments', 'attachement_direction', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('Establishments', 'region_code', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('Establishments', 'long_wording', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('Establishments', 'spinneret', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('Establishments', 'primary_group_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Groups',
            key: 'id'
          },
          allowNull: true,
          onDelete: 'SET NULL'
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Establishments', 'structure_number', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'attachement_direction', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'region_code', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'long_wording', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'spinneret', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'primary_group_id', { transaction: t }),
      ])
    })
  }
};