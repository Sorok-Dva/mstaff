const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mysql = require('./bin/mysql');
const pgsql = require('./bin/pgsql');
const app = require('express')();
const conf = require('dotenv').config().parsed;

/**
 * Connect to Mysql.
 */
mysql.connect(err => {
  if (err) {
    console.log('%s An error has occured while connecting to Mysql database.', chalk.green('x'));
    process.exit(1)
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
    process.exit(1)
  } else {
    console.log('%s Postgres server is connected to the application.', chalk.green('✓'));
  }
});

mysql.get('mstaff', (err, con) => {
  let migrate = {};

  migrate.users = () => {
    log('GET PgSQL Users Data ("utilisateur" table)');
    pgsql.get({
      name: 'get-users',
      text: 'SELECT * FROM utilisateur'
    }, (err, users) => {
        if (err) console.log(err);
        log(`${users.rows.length} rows founded.`);
        for (let i = 0; i < 25; i++) {
          let user = users.rows[i];
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
                    migrate.insertCandidate(candidat, userRes, (candidateId) => {
                      migrate.searchCandidateData(candidat.rows[0].id, candidateId);
                    });
                  }
                }
              });
            })
          } else {
            con.query('INSERT INTO Users SET ?', UserData);
          }
        }
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
      return callback(candidateRes.insertId);
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
        con.query('INSERT INTO Experiences SET ?', {
          candidate_id: newId,
          name: e.etablissement_custom_libelle,
          poste_id: e.poste_id,
          service_id: e.service_id,
          internship: e.is_stage,
          start: e.date_debut,
          end: e.date_fin,
          current: e.poste_actuel,
          createdAt: new Date(),
          updatedAt:  new Date()
        });
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
          stars: e.score - 1,
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
      let candidateSkills = candidatCompetences.rows;
      candidateSkills.forEach(e => {
        if (!e.libelle) {
          pgsql.get({ name: 'get-skillName', text: 'SELECT libelle FROM competence WHERE id = $1', values: [e.competence_id]},
            (err, skill) => {
              con.query('INSERT INTO CandidateSkills SET ?', { name: skill.rows[0].libelle, stars: e.score - 1, candidate_id: newId });
            })
        } else {
          con.query('INSERT INTO CandidateSkills SET ?', { name: e.libelle, stars: e.score - 1, candidate_id: newId });
        }
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
          stars: e.score - 1,
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