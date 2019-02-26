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

module.exports = app;