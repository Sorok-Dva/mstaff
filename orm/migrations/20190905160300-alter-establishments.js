'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const __ = process.cwd();
    const { Op } = Sequelize;
    const fs = require('fs');

    let sql = '' +
      /*'DELETE FROM Establishments WHERE name LIKE "%CROIX%ROUGE%";' +
      'ALTER TABLE Establishments ADD street_number VARCHAR(255);' +
      'ALTER TABLE Establishments ADD city, VARCHAR(255);' +
      'ALTER TABLE Establishments ADD region VARCHAR(255);' +
      'ALTER TABLE Establishments ADD country VARCHAR(255);' +
      'ALTER TABLE Establishments ADD postal_code VARCHAR(255);' +
      'ALTER TABLE Establishments ADD lat DECIMAL(10,8);' +
      'ALTER TABLE Establishments ADD lng DECIMAL(11,8);' +
      'ALTER TABLE Establishments ADD structure_number VARCHAR(255);' +
      'ALTER TABLE Establishments ADD attachement_direction VARCHAR(255);' +
      'ALTER TABLE Establishments ADD region_code VARCHAR(255);' +
      'ALTER TABLE Establishments ADD long_wording VARCHAR(255);' +
      'ALTER TABLE Establishments ADD spinneret VARCHAR(255);' +*/
      'ALTER TABLE Establishments ADD primary_group_id INT,' +
      'ADD CONSTRAINT fk_primary_group_id FOREIGN KEY (primary_group_id) REFERENCES Groups(id) ON DELETE SET NULL ON UPDATE CASCADE;';
      // 'ALTER TABLE Establishments ADD location_updatedAt VARCHAR(255);';

    // sql = 'START TRANSACTION;' + sql + 'COMMIT;';

    return queryInterface.sequelize.query(sql).catch( (err) => {
      queryInterface.sequelize.query('ROLLBACK;');
      return Promise.reject('Unexpected error, all changes have been manually rollbacked' + err);
    });


    /*.then(() => {
        /!*return new Promise((resolve, reject) => {
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
        });*!/
      });*/
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