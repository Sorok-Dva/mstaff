const conf = require('dotenv').config().parsed;
const path = require('path');

const express = require('express');
const middleware = require('./middlewares');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const esRouter = require('./routes/es');
const candidateRouter = require('./routes/candidate');
const boRouter = require('./routes/backOffice');
const apiRouter = require('./routes/api/api');
const apiUserRouter = require('./routes/api/user');
const apiCandidateRouter = require('./routes/api/candidate');

const app = express();

const env = conf.ENV || 'development';

if (env === 'development' || env === 'local') {
  app.use(middleware.loggerDev);
}

// express config
app.set('env', env);
app.set('trust proxy', true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
if (env !== 'development') {
  app.set('view cache', true);
}
app.set('view engine', 'hbs');

// ------ MIDDLEWARES
app.engine('hbs', middleware.exphbs);
app.use(middleware.helmet);
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(middleware.cookieParser);
app.use(middleware.csurf);
app.use(middleware.session);
app.use(middleware.i18n);
app.use(middleware.compress);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(middleware.passportInit);
app.use(middleware.passportSession);
app.use(middleware.flash);
app.use(middleware.setLocals);
app.use(middleware.wildcardSubdomains);
app.use(middleware.readOnlySessionForImpersonation);

// ------ ROUTES
app.use('/', indexRouter);
app.use('/', candidateRouter);
app.use('/', esRouter);
app.use('/user', usersRouter);
app.use('/back-office', boRouter);
app.use('/api', apiRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/candidate', apiCandidateRouter);

app.use(middleware.errorHandler); // errorHandler always must be in last position.

module.exports = app;