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
  pgsql.get({
    name: 'get-users',
    text: 'SELECT * FROM utilisateur'
  }, (err, users) => {
    if (err) console.log(err);
    mysql.get('mstaff', (err, con) => {
      if (err) console.log(err);
      for (let i = 0; i < users.rows.length; i++) {
        let user = users.rows[i];
        // get candidate associated to user
        pgsql.get({
          name: 'get-candidate', text: 'SELECT * FROM candidat WHERE utilisateur_id = $1', values: [user.id]
        }, (err, candidat) => {
          console.log(user);
          user.candidate = candidat.rows[0];
          let data = {
            email: user.email,
            password: user.password,
            type: userType(user.type),
            firstName: user.prenom || user.candidate ? user.candidate.prenom : null,
            lastName: user.nom || user.candidate ? user.candidate.nom : null,
            birthday: user.candidate ? user.candidate.date_naissance : null,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          };
          con.query('INSERT INTO Users SET ?', data);
        });
      }
    });
  });
};

let userType = (type) => {
  if (type === 'CANDIDAT') return 'candidate';
  if (type === 'ETABLISSEMENT') return 'es';
  if (type === 'PERSONNEL_INTERNE') return '';
};

module.exports = app;