const { src, dest, watch, series, parallel } = require('gulp');
const gls = require('gulp-live-server');
const cleanCSS = require('gulp-clean-css');
const uglifyjs = require('uglify-es');
const browsersync = require('browser-sync').create();
const rename = require('gulp-rename');

const composer = require('gulp-uglify/composer');

const minify = composer(uglifyjs, console);

const CSS_SRC = './src/stylesheets/*.css';
const CSS_DST = './public/assets/dist/css';
const JS_SRC = './src/javascripts/*.js';
const JS_DST = './public/assets/dist/js';

let browserSync = (done) => {
  setTimeout(() => {
    browsersync.init({
      proxy: {
        target: 'localhost:3001',
        ws: true
      }
    });
    done();
  }, 2500)
};

let serve = () => {
  const server = gls.new('./bin/www');
  server.start();

  //use gulp.watch to trigger server actions(notify, start or stop)
  watch(['static/**/*.css', 'static/**/*.js'], function (file) {
    server.notify.apply(server, [file]);
  });

  watch('./bin/www', server.start.bind(server)); //restart my server

  // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
  watch('./bin/www', function () {
    server.start.bind(server)()
  });
};

// Watch changes on all *.css files and trigger buildStyles() at the end.
let watchCss = () => {
  watch(
    [CSS_SRC],
    { events: 'all', ignoreInitial: false },
    series(buildStyles)
  );
};

let watchJs = () => {
  watch(
    [JS_SRC],
    { events: 'all', ignoreInitial: false },
    series(buildScripts)
  );
};

let buildStyles = () => {
  return src(CSS_SRC)
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(CSS_DST))
    .pipe(browsersync.reload({ stream: true }))
};

let buildScripts = () => {
  return src(JS_SRC)
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(JS_DST))
    .pipe(browsersync.reload({ stream: true }));
};

// Export commands.
exports.default = parallel(serve, browserSync, watchCss, watchJs); // $ gulp
exports.serve = serve; // $ gulp serve
exports.css = buildStyles; // $ gulp css
exports.js = buildScripts; // $ gulp js
exports.watchCSS = watchCss; // $ gulp watch
exports.watchJS = watchJs; // $ gulp watch
exports.build = series(buildStyles, buildScripts); // $ gulp build