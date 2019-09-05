'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { Op } = Sequelize;

    return queryInterface.sequelize.transaction(transaction => {

      return queryInterface.getForeignKeyReferencesForTable('EstablishmentGroups', { transaction: transaction })
        .then(foreignKeys => {

          let promises = [];

          for (let i = 0; i < foreignKeys.length; i++) {
            const foreignKey = foreignKeys[i];

            promises.push(
              queryInterface.removeConstraint('EstablishmentGroups', foreignKey.constraintName, { transaction: transaction })
            );

          }

          return Promise.all(promises);

        })
        .then(() => {

          return queryInterface.bulkDelete('Establishments', {
            name: {
              [Op.or]: [{[Op.like]: '%CROIX-ROUGE%'}, {[Op.like]: '%CROIX ROUGE%'}]
            } }, {transaction: transaction}
          );

        })
        .then(() => {

          return Promise.all([
            queryInterface.addConstraint('EstablishmentGroups', ['id_es'], {
              type: 'foreign key',
              name: 'EstablishmentGroups_ibfk_3',
              references: {
                table: 'Establishments',
                field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              transaction: transaction
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
              transaction: transaction
            })
          ]);

        })
        .then(() => {

          return Promise.all([
            queryInterface.addColumn('Establishments', 'structure_number', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'attachement_direction', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'region_code', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'long_wording', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'spinneret', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'primary_group_id', {
              type: Sequelize.INTEGER,
              references: {
                model: 'Groups',
                key: 'id'
              },
              allowNull: true,
              onDelete: 'SET NULL'
            }, { transaction: transaction })
          ]);

        })
        .then(() => {

          return queryInterface.bulkInsert('Establishments', [
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
          ], {transaction: transaction});

        });

    });

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