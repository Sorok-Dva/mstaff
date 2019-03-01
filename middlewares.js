const conf = require('dotenv').config().parsed;
const path = require('path');
const env = 'development';
const config = require(`./config/config.json`)[env];
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const exphbs = require('express-handlebars');
const compress = require('compression');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const handlebars = require('./helpers/handlebars').register(require('handlebars'));
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const i18n = require('i18n-express');
const logger = require('morgan');
const wildcardSubdomains = require('wildcard-subdomains');
const Sentry = require('@sentry/node');

const ServerController = require('./controllers/server');

Sentry.init({ dsn: 'https://4e13b8ebcfcc4e56beb0e0e18fc31d31@sentry.io/1405846' });

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
  errorHandler: (err, req, res, next) => { // error handler
    let opts = {};
    // set locals, only providing error in development
    if (env === 'development') {
      opts.error = err;
    } else {
      res.locals.error_msg = err.message;
    }
    // render the error page
    res.status(err.status || 500);
    if (!req.user) opts.layout = 'onepage';
    res.render('error', opts);
  },
  exphbs: exphbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
  }),
  flash: flash(),
  helmet: helmet(), // secure apps by setting various HTTP headers
  i18n: i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    cookieLangName: 'mstaff_lang',
    browserEnable: true,
    defaultLang: 'fr',
    siteLangs: ['fr'],
    textsVarName: 'tr'
  }),
  loggerDev: logger('dev'),
  passportInit: passport.initialize(),
  passportSession: passport.session(),
  passportAuthentication: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=login',
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
  sentryErrorHandler: () => Sentry.Handlers.errorHandler(),
  sentryRequestHandler: () => Sentry.Handlers.requestHandler(),
  setLocals: (req, res, next) => {
    if (req.url.search('static') !== -1) return next();
    res.locals.readOnly = req.session.readOnly ? 'lock' : 'unlock';
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.session = req.session || null;
    res.locals.csrfToken = req.csrfToken();
    next();
  },
  session: session({
    secret: conf.SECRET,
    saveUninitialized: true,
    store: sessionStore,
    resave: true
  }),
  verifyMaintenance: (req, res, next) => {
    ServerController.verifyMaintenance(status => {
      if (status === 'maintenance') {
        return res.render('index', { layout: 'maintenance' });
      }
      next();
    });
  },
  wildcardSubdomains: (req, res, next) => {
    if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
    // req.subdomain = req.subdomains.slice(-1)[0];
    next();
  }
};