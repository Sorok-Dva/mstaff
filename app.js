const { Env } = require('./helpers/helpers');
const { ErrorHandler, Express } = require('./middlewares');
const path = require('path');
const express = require('express');
const routes = require('./routes/router');

const app = express();

if (Env.isProd || Env.isPreProd) app.use(Express.sentryRequestHandler);
if (Env.isLocal || Env.isDev) app.use(Express.loggerDev);

// express config
app.engine('hbs', Express.exphbs.engine);
app.set('env', Env.current);
app.set('trust proxy', true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
if (Env.isProd) app.set('view cache', true);

// ------ Express
app.engine('.hbs', Express.exphbs.engine);
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(Express.cookieParser);
app.use(Express.compress);
app.use(Express.methodOverride);
app.use(Express.helmet);
if (Env.isDev || Env.isLocal || Env.isPreProd) app.use('/', express.static(path.join(__dirname, 'public')));
app.use(Express.csurf);
app.use(Express.session);
app.use(Express.i18n);
app.use(Express.verifyMaintenance);
app.use(Express.getServerMessages);
app.use(Express.passportInit); // MEMLEAK
app.use(Express.passportSession); //MEMLEAK
app.use(Express.flash);
app.use(Express.setLocals);
app.use(Express.wildcardSubdomains);
app.use(Express.readOnlySessionForImpersonation);
app.use(Express.themeCSSImport);
app.use(Express.appDomain);

// mount all routes on / path
app.use('/', routes);

if (Env.isProd || Env.isPreProd) app.use(Express.sentryErrorHandler);
app.use(ErrorHandler.notFoundError);
app.use(ErrorHandler.converter);
app.use(ErrorHandler.client);
app.use(ErrorHandler.log);
// if (Env.isProd || Env.isPreProd) app.use(ErrorHandler.sentrySenderErrorHandler);
app.use(ErrorHandler.api);

Models.init();

module.exports = app;
