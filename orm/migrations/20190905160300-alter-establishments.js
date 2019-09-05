'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    let refsConstraintName = [];
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.getForeignKeyReferencesForTable('EstablishmentGroups', { transaction: t }).then(
          v => {
            v.forEach( ref => { refsConstraintName.push(ref.constraintName) });
            return Promise.all(refsConstraintName.map((v) => {
              return queryInterface.removeConstraint('EstablishmentGroups', v, { transaction: t })
            }));
          }
        ),
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
        }, { transaction: t }),
        queryInterface.bulkInsert('Establishments', [
          {
            name: 'test',
            category: 'test',
            finess: 'test',
            siret: 'test',
            code: 'test',
            sector: 'test',
            address: 'test',
            town: 'test',
            url: 'test',
            structure_number: 'test',
            attachement_direction: '',
            region_code: 'test',
            long_wording: 'test',
            spinneret: 'test'
          }
        ])
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
    /*  return Promise.all([
        queryInterface.removeColumn('Establishments', 'structure_number', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'attachement_direction', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'region_code', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'long_wording', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'spinneret', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'primary_group_id', { transaction: t }),
      ])*/
    })
  }
};