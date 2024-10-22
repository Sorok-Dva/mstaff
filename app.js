const { Env } = require('./helpers/helpers');
const { ErrorHandler, Express } = require('./middlewares');
const path = require('path');
const express = require('express');

const indexRouter = require('./routes/index');
const esRouter = require('./routes/es');
const esSubDomainRouter = require('./routes/esSubdomain');
const groupSubDomainRouter = require('./routes/groupSubdomain');
const candidateRouter = require('./routes/candidate');
const boRouter = require('./routes/backOffice');
const apiRouter = require('./routes/api/api');
const apiUserRouter = require('./routes/api/user');
const apiCandidateRouter = require('./routes/api/candidate');
const apiBackOfficeRouter = require('./routes/api/backOffice');
const apiEsRouter = require('./routes/api/establishment');

const app = express();

if (Env.isProd || Env.isPreProd) app.use(Express.sentryRequestHandler);
if (Env.isLocal || Env.isDev) app.use(Express.loggerDev);

// express config
app.set('env', Env.current);
app.set('trust proxy', true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
if (Env.isProd) {
  app.set('view cache', true);
}

// ------ Express
app.engine('hbs', Express.exphbs);
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(Express.compress);
app.use(Express.methodOverride);
app.use(Express.helmet);
if (Env.isDev || Env.isLocal || Env.isPreProd) app.use('/', express.static(path.join(__dirname, 'public')));
app.use(Express.cookieParser);
app.use(Express.csurf);
app.use(Express.session);
app.use(Express.i18n);
app.use(Express.verifyMaintenance);
app.use(Express.passportInit);
app.use(Express.passportSession);
app.use(Express.flash);
app.use(Express.setLocals);
app.use(Express.wildcardSubdomains);
app.use(Express.readOnlySessionForImpersonation);

// ------ ROUTES
app.use('/', indexRouter);
app.use('/', candidateRouter); //candidate
app.use('/', esRouter); //recruiter
app.use('/esDomain', esSubDomainRouter);
app.use('/groupDomain', groupSubDomainRouter);
app.use('/back-office', boRouter);
app.use('/api', apiRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/candidate', apiCandidateRouter);
app.use('/api/back-office', apiBackOfficeRouter);
app.use('/api/es', apiEsRouter);

if (Env.isProd || Env.isPreProd) app.use(Express.sentryErrorHandler);
app.use(ErrorHandler.notFoundError);
app.use(ErrorHandler.converter);
app.use(ErrorHandler.client);
app.use(ErrorHandler.log);
// if (Env.isProd || Env.isPreProd) app.use(ErrorHandler.sentrySenderErrorHandler);
app.use(ErrorHandler.api);

module.exports = app;
