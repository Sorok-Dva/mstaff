const mysql = require('./bin/mysql');
const pgsql = require('./bin/pgsql');
const _ = require('lodash');
const fs = require('fs');

let migrateOtherData = () => {
  mysql.get('mstaff', (err, con) => {
    let migrate = {};

    migrate.other = () => {
      // migrate.groupsAndSuperGroups();
      // migrate.esAccounts();
      migrate.wishes();
    };

    migrate.groupsAndSuperGroups = () => {
      log('GET PgSQL Groups Data ("groupe" table)');
      pgsql.get({
        name: 'get-groups',
        text: 'SELECT * FROM groupe'
      }, (err, groups) => {
        if (err) console.log(err);
        log(`${groups.rows.length} rows founded (groups).`);
        groups.rows.forEach((group, i) => {
          let groupData = {
            name: group.libelle,
            oldId: group.id,
            createdAt: group.created_at || new Date(),
            updatedAt: group.updated_at || new Date(),
          };
          con.query('INSERT INTO `Groups` SET ?', groupData, (err, res) => {
            if (err) {
              console.log(err);
            }
          });
        });

        log('GET PgSQL Groups Data ("groupe" table)');
        pgsql.get({
          name: 'get-groups',
          text: 'SELECT * FROM super_groupe'
        }, (err, superGroups) => {
          if (err) console.log(err);
          log(`${superGroups.rows.length} rows founded (SuperGroups).`);
          superGroups.rows.forEach((superG, i) => {
            console.log(superG.groupes);
            let SgroupData = {
              name: superG.libelle,
              oldId: superG.id,
              createdAt: superG.created_at || new Date(),
              updatedAt: superG.updated_at || new Date(),
            };
            con.query('INSERT INTO `SuperGroups` SET ?', SgroupData, (err, insertRes) => {
              if (err) {
                console.log(err);
              } else {
                superG.groupes.forEach((group) => {
                  con.query('SELECT id, oldId FROM `Groups` WHERE oldId = ?', group, (err, res) => {
                    if (err) {
                      console.log(err);
                    } else {
                      let LinkData = {
                        id_group: res[0].id,
                        id_super_group: insertRes.insertId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      };
                      con.query('INSERT INTO `GroupsSuperGroups` SET ?', LinkData, (err, res) => {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  });
                })
              }
            });
          });
        });
      });
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

    migrate.wishes = () => {
      log('GET PgSQL User Data ("souhait" table)');
      fs.appendFileSync('applications.sql',
        'INSERT INTO Applications (`name`, wish_id, candidate_id, es_id, ref_es_id) VALUES ');
      pgsql.get({
        name: 'get-wishes',
        text: 'SELECT * FROM souhait'
      }, (err, wishes) => {
        if (err) console.log(err);
        log(`${wishes.rows.length} rows founded (wishes).`);
        wishes.rows.forEach((wish, i) => {
          pgsql.get({
            name: 'get-wishesPosts',
            text: 'SELECT * FROM souhait_postes WHERE souhait_id = $1', values: [wish.id]
          }, (err, posts) => {
            if (wish.candidat_id) {
              let wishPosts = [];
              if (posts.rows.length > 0) {
                con.query('SELECT id, oldId FROM Candidates WHERE oldId = ?', wish.candidat_id, (err, resCandidate) => {
                  if (err) {
                    console.log(err);
                  } else {
                    if (err || resCandidate.length < 1) {
                      console.log(err, resCandidate.length < 1);
                      console.log(resCandidate);
                    } else {
                      let i = 0;
                      posts.rows.forEach((post) => {
                        pgsql.get({
                          name: 'get-post',
                          text: 'SELECT * FROM poste WHERE id = $1', values: [post.poste_id]
                        }, (err, post) => {
                          i++;
                          if (post.rows.length === 1) {
                            wishPosts.push(post.rows[0].libelle)
                          }
                          if (i === posts.rows.length) {
                            let textPosts = `"${JSON.stringify(wishPosts).replace(/"/g, '\\"')}"`;
                            con.query('INSERT INTO Wishes SET ?', {
                              oldId: wish.id,
                              candidate_id: resCandidate[0].id,
                              name: wish.libelle,
                              contract_type: contractType(wish.type_contrat_id),
                              full_time: wish.temp_plein,
                              part_time: wish.temp_partiel,
                              day_time: wish.horaire_nuit,
                              night_time: wish.horaire_jour,
                              liberal_cabinets: wish.cabinets_liberaux,
                              start: wish.date_debut,
                              posts: textPosts,
                              end: wish.date_fin,
                              status: wish.statut,
                              lat: wish.lat,
                              lon: wish.lon,
                              geolocation: wish.mode_geo,
                              custom_address: wish.adresse_custom,
                              es_count: wish.nb_etablissements,
                              createdAt: new Date(),
                              updatedAt: new Date(),
                            }, (err, res) => {
                              if (err) {
                                console.log(err);
                              } else {
                                pgsql.get({
                                  name: 'get-applications',
                                  text: 'SELECT * FROM souhait_etablissements WHERE souhait_id = $1',
                                  values: [wish.id]
                                }, (err, applications) => {
                                  if (err) console.log(err);
                                  log(`${applications.rows.length} rows founded (applications).`);
                                  applications.rows.forEach((application, i) => {
                                    if (!_.isNil(application.numero_finess)) {
                                      application.numero_finess = application.numero_finess.replace(' ', '');
                                      con.query('SELECT * FROM Establishments WHERE finess = ?', application.numero_finess, (err, resEs) => {
                                        let es_id = null;
                                        if (err) {
                                          console.log(err);
                                        } else if (resEs.length < 1) {
                                        } else {
                                          es_id =  resEs[0].id;
                                        }
                                        fs.appendFileSync('applications.sql',
                                          `("${wish.libelle.replace(/"/g, '\\"') || 'Souhait sans nom'}", ${res.insertId}, ${resCandidate[0].id}, ${es_id}, '${application.numero_finess}'),`);
                                        /*con.query('INSERT INTO Applications SET ?', {
                                          name: wish.libelle || 'Souhait sans nom',
                                          wish_id: res.insertId,
                                          es_id,
                                          candidate_id: resCandidate[0].id,
                                          ref_es_id: application.numero_finess,
                                          createdAt: new Date(),
                                          updatedAt: new Date(),
                                        }, (err, res) => {
                                          if (err) {
                                            console.log(err);
                                          } else {
                                          }
                                        });*/
                                      });
                                    } else {
                                      fs.appendFileSync('applications.sql',
                                        `("${wish.libelle.replace(/"/g, '\\"') || 'Souhait sans nom'}", ${res.insertId}, ${resCandidate[0].id}, NULL,'${application.numero_finess}'),`);
                                    }
                                  });
                                });
                              }
                            });
                          }
                        });
                      });
                    }
                  }
                });
              }
            }
          });
        });
      });
    };

    migrate.other();
  });
};

let contractType = (id) => {
  if (id === 1) return 'cdi-cdd';
  if (id === 2) return 'vacation';
  if (id === 3) return 'internship';
  if (id === 4) return 'other';
  console.log(id);
  return '';
};


let log = (msg) => {
  console.log('[DB-MIGRATION]', msg);
};

module.exports = migrateOtherData;