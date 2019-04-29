const conf = require('dotenv').config().parsed;
const pg = require('pg');

const state = { pool: null };

const config = {
  user: 'mstaff',
  database: 'mstaff',
  password: 'eMsKZpe0jTleTqXhBq5z',
  host: '127.0.0.1',
  port: 5433,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
};

exports.connect = (done) => {
  state.pool = new pg.Pool(config);
  pg.defaults.ssl = false;
  this.get('SELECT NOW() as now', (err, res) => done(err, res));
};

exports.get = (statements, cb) => {
  let { pool } = state;
  if (!pool) return cb(new Error('Missing database connection.'));
  pool.connect((err, client, done) => {
    if (err) {
      console.log(err);
      return false;
    }
    client.query(statements, (err, res) => {
      done();
      if (err) return cb(err);
      return cb(null, res)
    });
  });
};