'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const __ = process.cwd();
    const fs = require('fs');

    return new Promise((resolve, reject) => {
      fs.readFile(`${__}/orm/jsonDatas/croix-rouge.json`, 'utf8', (err, data) => {
        if (err)
          return reject(err);
        try {
          let establishments = JSON.parse(data);
          let request = '' +
            'DELETE FROM EstablishmentReferences WHERE name LIKE "%CROIX%ROUGE%";' +
            'ALTER TABLE EstablishmentReferences MODIFY es_id INT DEFAULT 0;' +
            'ALTER TABLE EstablishmentReferences MODIFY createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;' +
            'ALTER TABLE EstablishmentReferences MODIFY updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;' +
            'INSERT INTO EstablishmentReferences ' +
            '(`name`, finess_et, name_long, address_num, address_type, address_name, address_more, address_dpt, address_town, category_name, cat, siret) VALUES ';

          let delRequest = 'DELETE FROM EstablishmentReferences WHERE finess_et IN (';


          for (let i = 0; i < establishments.length; i++) {
            let d = establishments[i];

            d.name = d.name === '' ? 'NULL' : d.name;
            d.finess = d.finess=== '' ? 'NULL' : d.finess;
            d.long_wording = d.long_wording === '' ? 'NULL' : d.long_wording;
            d.address1 = d.address1 === '' ? 'NULL' : d.address1;
            d.address2 = d.address2 === '' ? 'NULL' : d.address2;
            d.address3 = d.address3 === '' ? 'NULL' : d.address3;
            d.addComp = d.addComp === '' ? 'NULL' : d.addComp;
            d.code = d.code === '' ? 'NULL' : d.code;
            d.town1 = d.town1 === '' ? 'NULL' : d.town1;
            d.town2 = d.town2 === '' ? 'NULL' : d.town2;
            d.siret = d.siret === '' ? 'NULL' : d.siret;

            let completeTown = '';
            if (d.town1)
              completeTown += d.town1 + ' ';
            if (d.town2)
              completeTown += d.town2;
            if (completeTown === '')
              completeTown = 'NULL';

            request += `("${d.name}","${d.finess}","${d.long_wording}","${d.address1}","${d.address2}","${d.address3}","${d.addComp}","${d.code}","${completeTown}","Centre Hospitalier (C.H.)","3","${d.siret}")`;

            if (d.finess)
              delRequest += `'${d.finess}'`;

            if (i < establishments.length -1){
              request += ',';
              if (d.finess)
                delRequest += ',';
            }
            else {
              request += ';';
              delRequest += ');';
              request = delRequest + request;
            }
          }

          resolve (request);
        } catch (e) {
          reject(e);
        }
      });
    })
      .then( (request) => {
        return queryInterface.sequelize.query(request);
      })
      .catch( (err) => {
        return Promise.reject('Unexpected error, all changes have been manually rollbacked\n' + err);
      });

  },

  down: (queryInterface, Sequelize) => {
  }
};