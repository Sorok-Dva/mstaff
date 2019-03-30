const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mysql = require('./bin/mysql');
const pgsql = require('./bin/pgsql');
const app = require('express')();
const conf = require('dotenv').config().parsed;
const _ = require('lodash');

/**
 * Connect to Mysql.
 */
mysql.connect(err => {
  if (err) {
    console.log('%s An error has occured while connecting to Mysql database.', chalk.green('x'));
    // process.exit(1)
  } else {
    console.log('%s Mysql server is connected to the application. (host: %s)', chalk.green('✓'), conf.MYSQL_DATABASE_URL);
  }
});

/**
 * Connect to Postgresql.
 */
pgsql.connect(err => {
  if (err) {
    console.log('%s An error has occured while connecting to Postgres database.', chalk.green('x'));
    // process.exit(1)
  } else {
    console.log('%s Postgres server is connected to the application.', chalk.green('✓'));
  }
});

mysql.get('mstaff', (err, con) => {
  let migrate = {};
  let establishments = [];

  migrate.users = () => {
    log('GET PgSQL Users Data ("utilisateur" table)');
    pgsql.get({
      name: 'get-users',
      text: 'SELECT * FROM utilisateur'
    }, (err, users) => {
        if (err) console.log(err);
        log(`${users.rows.length} rows founded.`);
        users.rows.forEach((user, i) => {
          let UserData = {
            id: user.id,
            email: user.email,
            password: user.password,
            type: userType(user.type),
            firstName: user.prenom,
            lastName: user.nom,
            createdAt: user.created_at || new Date(),
            updatedAt: user.updated_at || new Date(),
          };
          if (userType(user.type) === 'candidate') {
            migrate.candidates(UserData, (UserData, candidat) => {
              delete UserData.id;
              con.query('INSERT INTO Users SET ?', UserData, (err, userRes) => {
                if (err) {
                  if (err.code === 'ER_DUP_ENTRY') console.log('[DUPLICATION] ', err.sqlMessage)
                } else {
                  if (candidat.rows.length === 1) {
                    migrate.insertCandidate(candidat, userRes, (candidateId, err) => {
                      if (!_.isNil(candidateId)) migrate.searchCandidateData(candidat.rows[0].id, candidateId);
                      else console.log(err);
                    });
                  }
                }
              });
            })
          } else if (userType(user.type) === 'es') {
            delete UserData.id;
            con.query('INSERT INTO Users SET ?', UserData, (err, userRes) => {
              if (err) {
                if (err.code === 'ER_DUP_ENTRY') console.log('[DUPLICATION] ', err.sqlMessage)
              } else {
                console.log
                if (_.isNil(establishments.find((data) => data.oldId === user.es_id).id)) {
                  migrate.searchAndMigrateES(user.es_id, () => {
                    migrate.createESAccount(user.es_id, userRes.insertId);
                  });
                } else {
                  migrate.createESAccount(user.es_id, userRes.insertId);
                }
              }
            });
          } else {
            con.query('INSERT INTO Users SET ?', UserData)
          }
        });
      });
  };

  migrate.candidates = (UserData, callback) => {
    let userId = UserData.id;
    log(`GET PgSQL Candidate Data ("candidat" table) of user id ${userId}`);
    pgsql.get({
      name: 'get-candidate', text: 'SELECT * FROM candidat WHERE utilisateur_id = $1', values: [userId]
    }, (err, candidat) => {
      let candidate = candidat.rows[0];
      if (candidat.rows.length === 1) {
        UserData.firstName = candidate.prenom;
        UserData.lastName = candidate.nom;
        UserData.birthday = candidate.date_naissance;
        UserData.postal_code = candidate.code_postal;
        UserData.town = candidate.ville;
        UserData.phone = candidate.telephone;
        UserData.createdAt = candidate.created_at || new Date();
        UserData.updatedAt = candidate.updated_at || new Date();
      }
      return callback(UserData, candidat);
    });
  };

  migrate.searchAndMigrateES = (es_id, callback) => {
    establishments.push(es_id);
    log(`GET PgSQL Establishment Data ("etablissement" table) of es id ${es_id}`);
    pgsql.get({
      name: 'get-es', text: 'SELECT * FROM etablissement WHERE id = $1', values: [es_id]
    }, (err, res) => {
      let es = res.rows[0];
      if (_.isNil(es)) return false;
      let esData = {
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

      con.query('INSERT INTO Establishments SET ?', esData, (err, esRes) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') console.log('[DUPLICATION] ', err.sqlMessage);
          console.log(err);
        } else {
          establishments[es_id] = { id: esRes.insertId, oldId: es_id };
          return callback();
        }
      });
    });
  };

  migrate.createESAccount = (es_id, user_id, callback) => {
    establishments.push(es_id);
    let esAcc = {
      user_id,
      es_id: establishments.find((data) => data.oldId === es_id).id,
      role: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    con.query('INSERT INTO ESAccounts SET ?', esAcc, (err, esAccRes) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') console.log('[DUPLICATION] ', err.sqlMessage);
        console.log(err);
      } else {
        console.log(`ESAccount added for user ${user_id} in es ${establishments.find((data) => data.oldId === es_id).id}`);
      }
    });
  };

  migrate.insertCandidate = (candidat, userRes, callback) => {
    let candidate = candidat.rows[0];
    let CandidateData = {
      user_id: userRes.insertId,
      description: candidate.description,
      photo: candidate.photo,
      video: candidate.video,
      status: candidate.status,
      views: candidate.vue,
      createdAt: candidate.created_at || new Date(),
      updatedAt: candidate.updated_at || new Date()
    };
    con.query('INSERT INTO Candidates SET ?', CandidateData, (err, candidateRes) => {
      return callback(!_.isNil(candidateRes) ? candidateRes.insertId : null, err);
    });
  };

  migrate.searchCandidateData = (oldId, newId) => {
   log(`Searching Candidate Data of candidate_id ${oldId} (old id) to insert for candidate_id ${newId} (new id)`);
   migrate.candidateExperiences(oldId, newId);
   migrate.candidateSoftwares(oldId, newId);
   migrate.candidateSkills(oldId, newId);
  };

  migrate.candidateExperiences = (oldId, newId) => {
    log(`GET PgSQL Candidate Experiences Data ("candidat_experiences" table) of candidate id ${oldId}`);
    pgsql.get({
      name: 'get-candidateXP', text: 'SELECT * FROM experience WHERE candidat_id = $1', values: [oldId]
    }, (err, experiences) => {
      let candidateExperiences = experiences.rows;
      candidateExperiences.forEach(e => {
        let data = {
          candidate_id: newId,
          poste_id: e.poste_id,
          service_id: e.service_id,
          internship: e.is_stage,
          start: e.date_debut,
          end: e.date_fin,
          current: e.poste_actuel,
          createdAt: new Date(),
          updatedAt:  new Date()
        };
        if (_.isNil(e.etablissement_custom_libelle)) {
          pgsql.get({ name: 'get-skillName', text: 'SELECT libelle FROM etablissement_gouv WHERE id = $1', values: [e.etablissement_gouv_id]},
            (err, es) => data.name =  !_.isNil(es.rows[0]) ? es.rows[0].libelle : ' - ')
        } else {
          data.name = e.etablissement_custom_libelle;
        }
        console.log(data);
        con.query('INSERT INTO Experiences SET ?', data);
      });
    });
  };

  migrate.candidateSoftwares = (oldId, newId) => {
    log(`GET PgSQL Candidate Softwares Data ("candidat_logiciels" table) of candidate id ${oldId}`);
    pgsql.get({
      name: 'get-candidateSoft', text: 'SELECT * FROM candidat_logiciels WHERE candidat_id = $1', values: [oldId]
    }, (err, candidatLogiciels) => {
      let candidateSoftwares = candidatLogiciels.rows;
      candidateSoftwares.forEach(e => {
        con.query('INSERT INTO CandidateSoftwares SET ?', {
          name: e.libelle,
          stars: e.score === 0 ? 0 : e.score - 1,
          candidate_id: newId
        });
      });
    });
  };

  migrate.candidateSkills = (oldId, newId) => {
    log(`GET PgSQL Candidate Skills Data ("candidat_competence" table) of candidate id ${oldId}`);
    pgsql.get({
      name: 'get-candidateSkills', text: 'SELECT * FROM candidat_competences WHERE candidat_id = $1', values: [oldId]
    }, (err, candidatCompetences) => {
      if (err) console.log(err);
      let candidateSkills = candidatCompetences.rows;
      candidateSkills.forEach(e => {
        let data;
        if (_.isNil(e.libelle)) {
          pgsql.get({ name: 'get-skillName', text: 'SELECT * FROM competence WHERE id = $1', values: [e.competence_id]},
            (err, skill) => data = { name: !_.isNil(skill.rows[0]) ? skill.rows[0].libelle : ' - ', stars: e.score - 1, candidate_id: newId })
        } else {
          data = { name: e.libelle, stars: e.score === 0 ? 0 : e.score - 1, candidate_id: newId };
        }
        con.query('INSERT INTO CandidateSkills SET ?', data);
      });
    });
  };

  migrate.candidateEquipments = (oldId, newId) => {
    log(`GET PgSQL Candidate Softwares Data ("candidat_logiciels" table) of candidate id ${oldId}`);
    pgsql.get({
      name: 'get-candidateEquipment', text: 'SELECT * FROM candidat_materiels WHERE candidat_id = $1', values: [oldId]
    }, (err, candidatEquipments) => {
      let candidateEquipments = candidatEquipments.rows;
      candidateEquipments.forEach(e => {
        con.query('INSERT INTO CandidateEquipments SET ?', {
          name: e.libelle,
          stars: e.score === 0 ? 0 : e.score - 1,
          candidate_id: newId
        });
      });
    });
  };
  log('Starting DBs Migration');
  migrate.users();

});

let userType = (type) => {
  if (type === 'CANDIDAT') return 'candidate';
  if (type === 'ETABLISSEMENT') return 'es';
  if (type === 'PERSONNEL_INTERNE') return '';
  console.log(type); return '';
};

let log = (msg) => {
  console.log('[DB-MIGRATION]', msg);
};

module.exports = app;