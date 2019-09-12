'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const __ = process.cwd();
    const { Op } = Sequelize;
    const fs = require('fs');

    return queryInterface.sequelize.transaction(transaction => {

      return queryInterface.getForeignKeyReferencesForTable('Subdomains', { transaction: transaction })
        .then(foreignKeys => {

          let promises = [];

          for (let i = 0; i < foreignKeys.length; i++) {
            const foreignKey = foreignKeys[i];

            promises.push(
              queryInterface.removeConstraint('Subdomains', foreignKey.constraintName, { transaction: transaction })
            );

          }

          return Promise.all(promises);

        })
        .then(() => {
          return Promise.all([
            queryInterface.addConstraint('Subdomains', ['es_id'], {
              type: 'foreign key',
              name: 'Subdomains_ibfk1',
              references: {
                table: 'Establishments',
                field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              transaction: transaction
            }),
            queryInterface.addConstraint('Subdomains', ['group_id'], {
              type: 'foreign key',
              name: 'Subdomains_ibfk2',
              references: {
                table: 'Groups',
                field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              transaction: transaction
            }),
            queryInterface.addConstraint('Subdomains', ['super_group_id'], {
              type: 'foreign key',
              name: 'Subdomains_ibfk3',
              references: {
                table: 'SuperGroups',
                field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              transaction: transaction
            }),
          ]);

        })
        .then(() => {
          return queryInterface.bulkDelete('Establishments', {
            name: {
              [Op.or]: [{ [Op.like]: '%CROIX-ROUGE%' }, { [Op.like]: '%CROIX ROUGE%' }]
            } }, { transaction: transaction }
          );

        })
        .then(() => {
          return Promise.all([
            queryInterface.addColumn('Establishments', 'street_number', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'street_name', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'city', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'department', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'region', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'country', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'postal_code', {
              type: Sequelize.STRING,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'lat', {
              type: Sequelize.DECIMAL(10, 8),
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'lng', {
              type: Sequelize.DECIMAL(11, 8),
              allowNull: true
            }, { transaction: transaction }),
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
            }, { transaction: transaction }),
            queryInterface.addColumn('Establishments', 'location_updatedAt', {
              type: Sequelize.DATE,
              allowNull: true
            }, { transaction: transaction }),
            queryInterface.addColumn('Applications', 'is_available', {
              type: Sequelize.BOOLEAN,
              allowNull: true,
              defaultValue: 1
            }, { transaction: transaction }),
            queryInterface.removeColumn('Candidates', 'is_available', { transaction: transaction }),
          ]);
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            fs.readFile(`${__}/orm/jsonDatas/croix-rouge.json`, 'utf8', (err, data) => {
              if (err)
                return reject(err);
              try {
                let datas = JSON.parse(data);
                let arrayDatas = [];

                datas.forEach(d => {
                  let formattedObject = {};
                  for (const dKey in d) {
                    if (dKey === 'address1' || dKey === 'address2' || dKey === 'address3' || dKey === 'town1' || dKey === 'town2')
                      continue;
                    if (dKey === 'Adresse physique - Complément'){
                      d.address1 = d[dKey];
                      continue;
                    }
                    formattedObject[dKey] = d[dKey];
                  }
                  formattedObject.address = d.address1 + ' ' + d.address2 + ' ' + d.address3;
                  formattedObject.town = d.town1 + ' ' + d.town2;
                  arrayDatas.push(formattedObject);
                });
                resolve (queryInterface.bulkInsert('Establishments', arrayDatas, { transaction: transaction }));
              } catch (e) {
                reject(e);
              }
            });
          });
        });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Establishments', 'street_number', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'street_name', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'city', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'department', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'region', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'country', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'postal_code', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'lat', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'lng', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'structure_number', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'attachement_direction', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'region_code', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'long_wording', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'spinneret', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'primary_group_id', { transaction: t }),
        queryInterface.removeColumn('Establishments', 'location_updatedAt', { transaction: t }),
        queryInterface.removeColumn('Applications', 'is_available', { transaction: t }),
        queryInterface.addColumn('Candidates', 'is_available', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }, { transaction: t }),
      ])
    })
  }
};