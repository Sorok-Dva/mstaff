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

let migrate = {};

migrate.users = () => {
  log('GET PgSQL Users Data ("utilisateur" table)');
  pgsql.get({
    name: 'get-users',
    text: 'SELECT * FROM utilisateur'
  }, (err, users) => {
    if (err) console.log(err);
    mysql.get('mstaff', (err, con) => {
      if (err) console.log(err);
      log(`${users.rows.length} rows founded.`);
      for (let i = 0; i < 25; i++) {
        let user = users.rows[i];
        // get candidate associated to user
        this.candidates(user, (UserData) => {
          con.query('INSERT INTO Users SET ?', UserData, (err, userRes) => {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') console.log('[DUPLICATION] ', err.sqlMessage)
            } else {
              if (candidat.rows.length === 1) {
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

                });
              }
            }
          });
        })
      }
    });
  });
};

migrate.candidates = (user, callback) => {
  log(`GET PgSQL Candidate Data ("candidat" table) of user id ${user.id}`);
  pgsql.get({
    name: 'get-candidate', text: 'SELECT * FROM candidat WHERE utilisateur_id = $1', values: [user.id]
  }, (err, candidat) => {
    let candidate = candidat.rows[0];
    let UserData = {
      email: user.email,
      password: user.password,
      type: userType(user.type),
      firstName: user.prenom,
      lastName: user.nom,
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    };
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
    return callback(UserData);
  });
};

let userType = (type) => {
  if (type === 'CANDIDAT') return 'candidate';
  if (type === 'ETABLISSEMENT') return 'es';
  if (type === 'PERSONNEL_INTERNE') return '';
  console.log(type); return '';
};

let log = (msg) => {
  console.log('[DB-MIGRATION]', msg);
};

log('Starting DBs Migration');
migrate.users();

module.exports = app;