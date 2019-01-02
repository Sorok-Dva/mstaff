const conf = require('dotenv').config().parsed;
const path = require('path');

const express = require('express');
const middleware = require('./middlewares');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const candidateRouter = require('./routes/candidate');
const boRouter = require('./routes/backOffice');
const apiRouter = require('./routes/api/api');
const apiUserRouter = require('./routes/api/user');

const app = express();

const env = conf.ENV || 'development';

if (env === 'development' || env === 'local') {
  app.use(middleware.loggerDev);
  process.on('uncaughtException', error => {
    console.log('uncaught');
    if(!error.isOperational) {
      throw new Error(error);
    }
    process.exit(1);
  });
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.cookieParser);
app.use(middleware.csurf);
app.use(middleware.session);
app.use(middleware.sass);
app.use(middleware.i18n);
app.use(middleware.compress);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(middleware.fileUpload);
app.use(middleware.passportInit);
app.use(middleware.passportSession);
app.use(middleware.flash);
app.use(middleware.setLocals);
app.use(middleware.wildcardSubdomains);

// ------ ROUTES
app.use('/', indexRouter);
app.use('/', candidateRouter);
app.use('/user', usersRouter);
app.use('/back-office', boRouter);
app.use('/api', apiRouter);
app.use('/api/user', apiUserRouter);

app.use(middleware.errorHandler); // errorHandler always must be in last position.

module.exports = app;