const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const compress = require('compression');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const path = require('path');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('./helpers/index').register(require('handlebars'));
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const i18n = require('i18n-express');
const conf = require('dotenv').config().parsed;
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// -- Express Config
app.engine('hbs', exphbs({
  extname         : 'hbs',
  defaultLayout   : 'default',
  layoutsDir      : path.join(__dirname, '/layouts'),
  partialsDir     : path.join(__dirname, '/views/partials')
}));
app.use(cookieParser());

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'),
  cookieLangName: 'mstaff_lang',
  browserEnable: true,
  defaultLang: 'fr',
  siteLangs: ['fr'],
  textsVarName: 'tr'
}));
app.use(helmet());
app.use(fileUpload());
app.use(compress({
  filter: function (req, res) {
    return (/json|text|javascript|css|image\/svg\+xml|application\/x-font-ttf/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// -- Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.user || null;
  res.locals.admin = !!(req.user && config.roles.includes(req.user.role));
  next();
});

// ------ ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
