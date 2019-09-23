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
            'DELETE FROM Establishments WHERE name LIKE "%CROIX%ROUGE%";' +
            'ALTER TABLE Establishments ADD street_number VARCHAR(255);' +
            'ALTER TABLE Establishments ADD city VARCHAR(255);' +
            'ALTER TABLE Establishments ADD region VARCHAR(255);' +
            'ALTER TABLE Establishments ADD country VARCHAR(255);' +
            'ALTER TABLE Establishments ADD postal_code VARCHAR(255);' +
            'ALTER TABLE Establishments ADD lat DECIMAL(10,8);' +
            'ALTER TABLE Establishments ADD lng DECIMAL(11,8);' +
            'ALTER TABLE Establishments ADD structure_number VARCHAR(255);' +
            'ALTER TABLE Establishments ADD attachement_direction VARCHAR(255);' +
            'ALTER TABLE Establishments ADD region_code VARCHAR(255);' +
            'ALTER TABLE Establishments ADD long_wording VARCHAR(255);' +
            'ALTER TABLE Establishments ADD spinneret VARCHAR(255);' +
            'ALTER TABLE Establishments ADD primary_group_id INT, ADD CONSTRAINT fk_primary_group_id FOREIGN KEY (primary_group_id) REFERENCES `Groups`(id) ON DELETE SET NULL ON UPDATE CASCADE;' +
            'ALTER TABLE Establishments ADD location_updatedAt VARCHAR(255);' +
            'INSERT INTO Establishments ' +
            '(structure_number, attachement_direction, region_code, `name`, long_wording, spinneret, sector, category, `code`, url, siret, finess, address, town) VALUES ';

          let delRequest = 'DELETE FROM Establishments WHERE finess IN (';

          for (let i = 0; i < establishments.length; i++) {
            let d = establishments[i];
            let o = {};

            for (const dKey in d) {
              if (dKey === 'address1' || dKey === 'address2' || dKey === 'address3' || dKey === 'town1' || dKey === 'town2' || dKey === 'addComp')
                continue;
              o[dKey] = d[dKey];
            }

            let add = [d.addComp, d.address1, d.address2, d.address3];
            let town = [d.town1, d.town2];

            o.address = '';
            o.town = '';

            add.forEach( item => {
              if (item)
                o.address += '' + item;
              if (o.address)
                o.address += ' ';
            });

            town.forEach( item => {
              if (item)
                o.town += '' + item;
              if (o.town)
                o.town += ' ';
            });

            o.structure_number = o.structure_number === '' ? 'NULL' : o.structure_number;
            o.attachement_direction = o.attachement_direction === '' ? 'NULL' : o.attachement_direction;
            o.region_code = o.region_code === '' ? 'NULL' : o.region_code;
            o.name = o.name === '' ? 'NULL' : o.name;
            o.long_wording = o.long_wording === '' ? 'NULL' : o.long_wording;
            o.spinneret = o.spinneret === '' ? 'NULL' : o.spinneret;
            o.sector = o.sector === '' ? 'NULL' : o.sector;
            o.category = o.category === '' ? 'NULL' : o.category;
            o.code = o.code === '' ? 'NULL' : o.code;
            o.url = o.url === '' ? 'NULL' : o.url;
            o.siret = o.siret === '' ? 'NULL' : o.siret;
            o.finess = o.finess === '' ? 'NULL' : o.finess;
            o.address = o.address === '' ? 'NULL' : o.address;
            o.town = o.town === '' ? 'NULL' : o.town;

            request += `("${o.structure_number}","${o.attachement_direction}","${o.region_code}","${o.name}","${o.long_wording}","${o.spinneret}","${o.sector}","${o.category}","${o.code}","${o.url}","${o.siret}","${o.finess}","${o.address}","${o.town}")`;

            if (o.finess)
              delRequest += `'${o.finess}'`;

            if (i < establishments.length -1){
              request += ',';
              if (o.finess)
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