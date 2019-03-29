const conf = require('dotenv').config().parsed;
const mysql = require('mysql');

const state = {
  pool: null,
  mode: null,
};

exports.connect = (done) => {
  state.pool = mysql.createPoolCluster();

  state.pool.add('mstaff', {
    host: conf.MYSQL_DATABASE_URL,
    user: conf.MYSQL_DATABASE_USER,
    password: conf.MYSQL_DATABASE_PASS,
    database: 'mstaff_migration'
  });

  this.get('mstaff', (err, res) => done(err, res));
};

exports.get = (db, done) => {
  let { pool } = state;
  if (!pool) return done(new Error('Missing database connection.'));
  pool.getConnection(db, (err, connection) => {
    if (err) return done(err);
    done(null, connection);
  })
};