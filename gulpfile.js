const { src, dest, watch, series, parallel } = require('gulp');
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
  browsersync.init({
    proxy: {
      target: 'localhost:3001',
      ws: true
    }
  });
  done();
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

let buildScripts = (cb) => {
  return src(JS_SRC)
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(JS_DST))
    .pipe(browsersync.reload({ stream: true }));
};

// Export commands.
exports.default = parallel(browserSync, watchCss, watchJs); // $ gulp
exports.css = buildStyles; // $ gulp css
exports.js = buildScripts; // $ gulp js
exports.watchCSS = watchCss; // $ gulp watch
exports.watchJS = watchJs; // $ gulp watch
exports.build = series(buildStyles, buildScripts); // $ gulp build