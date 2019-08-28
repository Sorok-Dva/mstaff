const { src, dest, watch, series, parallel } = require('gulp');
const { Env } = require('./helpers/helpers');
const config = require('dotenv').config().parsed;
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const cssimport = require('gulp-cssimport');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const DST_PATH = './public/assets/dist';
const CSS_SRC = './src/stylesheets/*.css';
const CSS_DST = './public/assets/dist/css';
const JS_SRC_BASE = './src/javascripts/*.js';
const JS_SRC_SUBFOLDERS = './src/javascripts/*/*.js';
const JS_DST = './public/assets/dist/js';
const THEME_CSS_MAIN = './src/theme/mstaff/css/style.scss';
const THEME_CSS_DIR = './src/theme/mstaff/css/*/*.scss';
const THEME_CSS_DST = './public/assets/theme/mstaff/css';

/**
 * @task clean
 * cleans the destination directory of old files
 */
let clean = (done) => {
  del([DST_PATH], done())
};

let browserSync = (done) => {
  if (Env.current === 'development' && config.BROWSERSYNC !== 'false') {
    browsersync.init({
      proxy: {
        target: 'localhost:3001',
        ws: true
      }
    });
  }
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
    [JS_SRC_BASE],
    { events: 'all', ignoreInitial: false },
    series(buildScripts)
  );
};

let watchSass = () => {
  watch(
    [THEME_CSS_DIR],
    { events: 'all', ignoreInitial: false },
    series(buildTheme)
  );
};

let buildStyles = () => {
  if (Env.current === 'development') {
    return src(CSS_SRC)
      .pipe(cleanCSS())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(CSS_DST))
      .pipe(browsersync.reload({ stream: true }))
  } else {
    return src(CSS_SRC)
      .pipe(cleanCSS())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(CSS_DST))
  }
};

let buildScripts = () => {
  if (Env.current === 'development') {
    return src([JS_SRC_BASE, JS_SRC_SUBFOLDERS])
      .pipe(sourcemaps.init())
      .pipe(terser())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write())
      .pipe(dest(JS_DST))
      .pipe(browsersync.reload({ stream: true }));
  } else {
    return src([JS_SRC_BASE, JS_SRC_SUBFOLDERS])
      .pipe(terser())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(JS_DST));
  }

};

let buildTheme = () => {
  console.log('DEBUG THEME COMPILING');
  if (Env.current === 'development') {
    return src(THEME_CSS_MAIN)
      .pipe(sass().on('error', sass.logError))
      .pipe(cssimport())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(THEME_CSS_DST))
      .pipe(browsersync.reload({ stream: true }))
  }
};

/*
*
// Optimize Images
function images() {
  return gulp
    .src("./assets/img/** /*")
  .pipe(newer("./_site/assets/img"))
  .pipe(
    imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          {
            removeViewBox: false,
            collapseGroups: true
          }
        ]
      })
    ])
  )
  .pipe(gulp.dest("./_site/assets/img"));
}
*/
// Export commands.
exports.default = parallel(browserSync, watchCss, watchJs, watchSass); // $ gulp
exports.clean = clean; // $ gulp clean
exports.css = buildStyles; // $ gulp css
exports.js = buildScripts; // $ gulp js
exports.theme = buildTheme; // $ gulp theme
exports.watchCSS = watchCss; // $ gulp watch
exports.watchJS = watchJs; // $ gulp watch
exports.watchSass = watchSass; // $ gulp watch
exports.build = series(clean, buildStyles, buildScripts, buildTheme); // $ gulp build