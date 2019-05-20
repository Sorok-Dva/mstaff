const _ = require('lodash');
const conf = require('dotenv').config().parsed;
const packageJson = require('../package');
const path = require('path');
const { Env } = require('../helpers/helpers');
const { Establishment, Server, Subdomain } = require('../components');
const Sentry = require('../bin/sentry');
const config = require(`../orm/config/config`)[Env.current];
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const compress = require('compression');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const handlebars = require('../helpers/handlebars').register(require('handlebars'));
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const i18n = require('i18n-express');
const logger = require('morgan');
const staticify = require('staticify')(path.join(__dirname, '../public'));

let sessionStore = new MySQLStore({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database
});

module.exports = {
  compress: compress({
    filter: (req, res) => {
      return (/json|text|javascript|css|image\/svg\+xml|application\/x-font-ttf/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }),
  cookieParser: cookieParser(conf.SECRET),
  cors: cors(), // enable CORS - Cross Origin Resource Sharing
  csurf: csurf({ cookie: true }), // enable crsf token middleware
  exphbs: exphbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials')
  }),
  flash: flash(),
  helmet: helmet(), // secure apps by setting various HTTP headers
  i18n: i18n({
    translationsPath: path.join(__dirname, '../i18n'),
    cookieLangName: 'mstaff_lang',
    browserEnable: true,
    defaultLang: 'fr',
    siteLangs: ['fr'],
    textsVarName: 'tr'
  }),
  loggerDev: logger('dev'),
  methodOverride: methodOverride(),
  passportInit: passport.initialize(),
  passportSession: passport.session(),
  passportAuthentication: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }),
  /**
   * readOnlySessionForImpersonation middleware : security method that ensure that the current impersonate session
   *                                              can't access to CUD routes if the session is in read only mode.
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  readOnlySessionForImpersonation: (req, res, next) => {
    if (req.session && req.session.originalUser) {
      let isBORoute = req.url.split('back-office').length - 1 !== 0;
      if (req.session.readOnly && !isBORoute && req.method !== 'GET') {
        return res.status(403).json('Operation not allowed, session is in read only mode.')
      }
      next();
    } else next();
  },
  staticify: staticify.middleware,
  sentryErrorHandler: Sentry.Handlers.errorHandler(),
  sentryRequestHandler: Sentry.Handlers.requestHandler(),
  sentryUnhandledRejection: (reason) => Sentry.captureMessage(reason),
  setLocals: (req, res, next) => {
    if (req.url.search('static') !== -1) return next();
    res.locals.readOnly = req.session.readOnly ? 'lock' : 'unlock';
    res.locals.getVersionedPath = staticify.getVersionedPath;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.session = req.session || null;
    res.locals.v = packageJson.version;
    res.locals.domain = conf.DOMAIN;
    res.locals.csrfToken = req.csrfToken();
    if ((Env.isProd || Env.isPreProd) && !_.isNil(req.user)) {
      Sentry.configureScope((scope) => {
        scope.setUser(req.user);
      });
    }
    next();
  },
  session: session({
    secret: conf.SECRET,
    saveUninitialized: true,
    store: sessionStore,
    resave: true
  }),
  verifyMaintenance: (req, res, next) => {
    if (req.url.search('static') !== -1 || req.url.search('back-office') !== -1) return next();
    Server.Main.verifyMaintenance(status => {
      if (status === 'maintenance') {
        return res.render('index', { layout: 'maintenance' });
      }
      next();
    });
  },
  wildcardSubdomains: (req, res, next) => {
    if (req.url.search('static') !== -1 || req.subdomains.length === 0 || req.subdomains[0] === 'dev' || req.subdomains[0] === 'pre-prod')
      return next();
    Subdomain.Main.find(req, res, (subdomain) => {
      if (subdomain.es_id) {
        Establishment.Main.find(subdomain.es_id, (data) => {
          return res.render('index', { layout: 'maintenance' });
          /*res.locals.es = data;
          req.es = data;
          req.url = `/esDomain${req.url}`;
          return next();*/
        });
      } else if (subdomain.group_id) {
        Subdomain.Group.find(subdomain.group_id, (data) => {
          return res.render('index', { layout: 'maintenance' });
          /* res.locals.group = data;
          req.group = data;
          req.url = `/groupDomain${req.url}`;
          return next();*/
        });
      } else {
        return next();
      }
    });
  }
};