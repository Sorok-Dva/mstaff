const { Env } = require('../helpers/helpers');
const packageJson = require('../package');
let Sentry = require('@sentry/node');

if (Env.isProd || Env.isPreProd) {
  Sentry.init({
    dsn: 'https://4e13b8ebcfcc4e56beb0e0e18fc31d31@sentry.io/1405846',
    release: `${packageJson.name}@${packageJson.version}`,
    attachStacktrace: true,
    environment: Env.current
  });
}

module.exports = Sentry;