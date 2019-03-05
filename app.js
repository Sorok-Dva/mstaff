const { Env } = require('./helpers/helpers');
const path = require('path');

const express = require('express');
const middleware = require('./middlewares');
const ErrorHandler = require('./middlewares/errorHandler');

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

if (Env.isLocal || Env.isDev) app.use(middleware.loggerDev);

// express config
app.set('env', Env.current);
app.set('trust proxy', true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
if (Env.isProd) app.set('view cache', true);

// ------ MIDDLEWARES
app.engine('hbs', middleware.exphbs);
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(middleware.compress);
app.use(middleware.methodOverride);
app.use(middleware.helmet);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(middleware.cookieParser);
app.use(middleware.csurf);
app.use(middleware.session);
app.use(middleware.i18n);
app.use(middleware.verifyMaintenance);
app.use(middleware.passportInit);
app.use(middleware.passportSession);
app.use(middleware.flash);
app.use(middleware.setLocals);
app.use(middleware.wildcardSubdomains);
app.use(middleware.readOnlySessionForImpersonation);

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
// app.use(ErrorHandler.sentrySenderErrorHandler);
app.use(ErrorHandler.api);

app.use(middleware.errorHandler); // errorHandler always must be in last position.

module.exports = app;