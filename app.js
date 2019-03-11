const { Env } = require('./helpers/helpers');
const { ErrorHandler, Express } = require('./middlewares');
const path = require('path');
const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const esRouter = require('./routes/es');
const candidateRouter = require('./routes/candidate');
const boRouter = require('./routes/backOffice');
const apiRouter = require('./routes/api/api');
const apiUserRouter = require('./routes/api/user');
const apiCandidateRouter = require('./routes/api/candidate');
const apiBackOfficeRouter = require('./routes/api/backOffice');
const apiEsRouter = require('./routes/api/establishment');

const app = express();

if (Env.isLocal || Env.isDev) app.use(Express.loggerDev);

// express config
app.set('env', Env.current);
app.set('trust proxy', true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
if (Env.isProd) app.set('view cache', true);

// ------ Express
if (Env.isProd) app.use(Express.sentryRequestHandler);
app.engine('hbs', Express.exphbs);
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(Express.compress);
app.use(Express.methodOverride);
app.use(Express.helmet);
app.use('/static', express.static(path.join(__dirname, 'public')));
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
app.use('/user', usersRouter);
app.use('/back-office', boRouter);
app.use('/api', apiRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/candidate', apiCandidateRouter);
app.use('/api/back-office', apiBackOfficeRouter);
app.use('/api/es', apiEsRouter);

app.use(ErrorHandler.notFoundError);
app.use(ErrorHandler.converter);
app.use(ErrorHandler.client);
app.use(ErrorHandler.log);
if (Env.isProd) app.use(ErrorHandler.sentrySenderErrorHandler);
app.use(ErrorHandler.api);

app.use(Express.errorHandler); // errorHandler always must be in last position.

module.exports = app;