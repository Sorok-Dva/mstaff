const mysql = require('./bin/mysql');
const pgsql = require('./bin/pgsql');
const _ = require('lodash');

let migrateOtherData = () => {
  mysql.get('mstaff', (err, con) => {
    let migrate = {};

    migrate.other = () => {
      migrate.esAccounts();
    };

    migrate.esAccounts = () => {
      log('GET PgSQL User Data ("utilisateur" table)');
      pgsql.get({
        name: 'get-esUsers',
        text: 'SELECT * FROM utilisateur WHERE "type" = \'ETABLISSEMENT\''
      }, (err, esUsers) => {
        if (err) console.log(err);
        log(`${esUsers.rows.length} rows founded.`);
        esUsers.rows.forEach((user, i) => {
          if (user.es_id) {
            con.query('SELECT id, oldId FROM Establishments WHERE oldId = ?', user.es_id, (err, resEs) => {
              if (err) {
                console.log(err);
              } else {
                con.query('SELECT id, oldId FROM Users WHERE oldId = ?', user.id, (err, res) => {
                  if (err || resEs.length < 1 || res.length < 1) {
                    console.log(err, resEs.length < 1, res.length < 1);
                    console.log(resEs, res, user.id);
                  } else {
                    console.log(resEs[0].id);

                    con.query('INSERT INTO ESAccounts SET ?', {
                      user_id: res[0].id,
                      es_id: resEs[0].id,
                      role: 'User',
                      createdAt: res[0].created_at || new Date(),
                      updatedAt: res[0].updated_at || new Date(),
                    }, (err, res) => {
                      if (err) {
                        console.log(err);
                      }
                    });
                  }
                });
              }
            });
          } else if (user.es_list) {
            con.query('SELECT id, oldId FROM Users WHERE oldId = ?', user.id, (err, res) => {
              if (err || res.length < 1) {
                console.log(err, res.length < 1);
              } else {
                user.es_list.forEach((id) => {
                  console.log(`SELECT id, oldId FROM Establishments WHERE oldId = ${id}`);
                  con.query('SELECT id, oldId FROM Establishments WHERE oldId = ?', id, (err, resEs) => {
                    if (err || resEs.length < 1) {
                      console.log(err, resEs.length < 1);
                    } else {
                      con.query('INSERT INTO ESAccounts SET ?', {
                        user_id: res[0].id,
                        es_id: resEs[0].id,
                        role: 'User',
                        createdAt: res[0].created_at || new Date(),
                        updatedAt: res[0].updated_at || new Date(),
                      }, (err, res) => {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        });
      });
    };

    migrate.other();
  });
};

let log = (msg) => {
  console.log('[DB-MIGRATION]', msg);
};

module.exports = migrateOtherData;