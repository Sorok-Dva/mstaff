const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');

class Env {
  static get current() {
    return process.env.ENV
  }

  static get isTest() {
    return 'test' === Env.current
  }

  static get isLocal() {
    return 'local' === Env.current
  }

  static get isDemo() {
    return 'demo' === Env.current
  }

  static get isDev() {
    return 'development' === Env.current
  }

  static get isPreProd() {
    return 'pre-prod' === Env.current
  }

  static get isProd() {
    return 'production' === Env.current
  }
}


const reformatOpts = (opts) => {
  if (opts && opts.isSequelizeModel === true) return opts;
  if (_.isNil(opts)) return opts;
  const keys = _.keys(opts);
  const values = keys.map(k => opts[k]);
  const valuesReformatted = _.zipWith(keys, values, (k, v) => {
    if (k !== 'include') return v;
    if (_.isArray(v)) return v;
    return [reformatOpts(v)];
  });
  return _.zipObject(keys, valuesReformatted);
};

const omitByNil = o => _.omitBy(o, _.isNil);

module.exports = {
  Env,
  plain: e => e && e.get({ plain: true }),
  omitValue: (l, label) => _.filter(l, e => e !== label),
  omitByNil,
  isInt: (value) => {
    if (isNaN(value)) return false;
    return Number.isInteger(parseFloat(value));
  },
  getIp: (req) => {
    const ipNginx = req.headers['x-forwarded-for'];
    if (ipNginx) return ipNginx.split(', ')[0];
    return req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  },
  isArray: (obj) => Object.prototype.toString.call(obj) === '[object Array]',
  isString: (x) => Object.prototype.toString.call(x) === '[object String]',
  omitTimes: (x, { also = [] } = {}) => {
    const _omit = y => _.omit(y, ['created_at', 'updated_at', 'takenAt', 'deleted_at', ...also]);
    return this.isArray(x) ? x.map(_omit) : _omit(x);
  },
  formatDate: (_date) => {
    if (typeof _date === 'string') {
      return moment(new Date(_date)).toISOString();
    }
    return moment(_date).toISOString();
  },
  isEqualOrBeforeDate: (date, referenceDate) => moment(date).isSameOrBefore(referenceDate, 'day'),
  mkdirIfNotExists: (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  },
  // this is used to debug sequelize
  getIncludes: (opts) => {
    if (opts && opts.isSequelizeModel === true) return opts;
    if (_.isNil(opts)) return opts;
    if (_.isArray(opts)) return opts.map(this.getIncludes);
    const keys = _.keys(opts);
    const values = keys.map(k => opts[k]);
    const valuesReformatted = _.zipWith(keys, values, (k, v) => {
      // console.log('\nk', k);
      // console.log('v', v);
      if (k === 'include') {
        // console.log('is include');
        return this.getIncludes(v);
      }
      if (k === 'model') return v.tableName;
      // console.log('is undefined');
      return undefined;
    });
    return _.omitBy(_.zipObject(keys, valuesReformatted), _.isUndefined);
  },
  reformatOpts,
  upperCaseFirstLetter: str => _.upperFirst(str),
  getDate: (date) => date && moment(date).local().format('YYYY-MM-DD'),
  setToMidnight: m => moment(m).set({ millisecond: 0, second: 0, minute: 0, hour: 0 }),
  setToMidday: m => moment(m).set({ millisecond: 0, second: 0, minute: 0, hour: 8 }),
  getAge: birthdate => moment().diff(birthdate, 'years')
};
