const mysql = require('./bin/mysql');
const pgsql = require('./bin/pgsql');
const _ = require('lodash');

let migrateESData = () => {
  mysql.get('mstaff', (err, con) => {
    let migrate = {};

    migrate.es = () => {
      log('GET PgSQL Es Data ("etablissement" table)');
      pgsql.get({
        name: 'get-etablissement',
        text: 'SELECT * FROM etablissement'
      }, (err, establishments) => {
        if (err) console.log(err);
        log(`${establishments.rows.length} rows founded.`);
        establishments.rows.forEach((es, i) => {
          let EsData = {
            oldId: es.id,
            name: es.nom,
            finess: es.numero_finess || '-',
            sector: es.secteur,
            salaries_count: es.nb_employes,
            status: es.status,
            phone: es.telephone || '-',
            url: es.url,
            address: es.adresse,
            town: `${es.code_postal} ${es.ville}`,
            contact_identity: es.contacts,
            logo: es.logo,
            domain_name: es.domain_name,
            domain_enable: es.domain_enable,
            createdAt: es.created_at || new Date(),
            updatedAt: es.updated_at || new Date(),
          };
          con.query('INSERT INTO Establishments SET ?', EsData, (err, esRes) => {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') console.log('[DUPLICATION] ', err.sqlMessage);
              console.log(err);
            } else {
              EsData.id = esRes.insertId;
              migrate.favorites(EsData);
            }
          });
        });
      });
    };

    migrate.favorites = (EsData) => {
      let esId = EsData.oldId;
      log(`GET PgSQL ES Favorites Data ("etablissement_favoris" table) of es id ${esId}`);
      pgsql.get({
        name: 'get-candidate', text: 'SELECT * FROM etablissement_favoris WHERE es_id = $1', values: [esId]
      }, (err, favorites) => {
        favorites.rows.forEach((fav, i) => {
          con.query('SELECT id, oldId FROM Candidates WHERE oldId = ?', fav.candidat_id, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              let favData = {
                es_id: EsData.id,
                candidate_id: res[0].id,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              con.query('INSERT INTO FavoriteCandidates SET ?', favData, (err, res) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          });
        });
      });
    };

    migrate.es();
  });
};


let log = (msg) => {
  console.log('[DB-MIGRATION]', msg);
};

module.exports = migrateESData;