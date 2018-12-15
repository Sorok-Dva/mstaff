const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const compress = require('compression');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
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
const apiRouter = require('./routes/api/api');
const apiUserRouter = require('./routes/api/user');

const app = express();

const env = conf.ENV || 'development';
const config = require(`${__dirname}/config/config.json`)[env];

// -- Express Session configuration
let sessionStore = new MySQLStore({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database
});

app.use(logger('dev'));
// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(conf.SECRET));

// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// process.on('unhandledRejection', reason => Sentry.send(reason, { context: 'unhandledRejection' })); To implement later

app.use(session({
  secret: conf.SECRET,
  saveUninitialized: true,
  store: sessionStore,
  resave: true
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', true);
app.set('view engine', 'hbs');
// -- Express Config
app.engine('hbs', exphbs({
  extname         : 'hbs',
  defaultLayout   : 'default',
  layoutsDir      : path.join(__dirname, '/views/layouts'),
  partialsDir     : path.join(__dirname, '/views/partials')
}));

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'),
  cookieLangName: 'mstaff_lang',
  browserEnable: true,
  defaultLang: 'fr',
  siteLangs: ['fr'],
  textsVarName: 'tr'
}));

app.set('env', env);
app.set('trust proxy', true);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(compress({
  filter: function (req, res) {
    return (/json|text|javascript|css|image\/svg\+xml|application\/x-font-ttf/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));
app.use(fileUpload());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/static', express.static(path.join(__dirname, 'public')));
// ------ ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/api/user', apiUserRouter);

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