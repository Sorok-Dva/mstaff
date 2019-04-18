const { src, dest, watch, series, parallel } = require('gulp');
const { Env } = require('./helpers/helpers');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const DST_PATH = './public/assets/dist';
const CSS_SRC = './src/stylesheets/*.css';
const CSS_DST = './public/assets/dist/css';
const JS_SRC = './src/javascripts/*.js';
const JS_DST = './public/assets/dist/js';

/**
 * @task clean
 * cleans the destination directory of old files
 */
let clean = (done) => {
  del([DST_PATH], done())
};

let browserSync = (done) => {
  if (Env.current === 'development') {
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
    [JS_SRC],
    { events: 'all', ignoreInitial: false },
    series(buildScripts)
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
    return src(JS_SRC)
      .pipe(sourcemaps.init())
      .pipe(terser())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write())
      .pipe(dest(JS_DST))
      .pipe(browsersync.reload({ stream: true }));
  } else {
    return src(JS_SRC)
      .pipe(terser())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(JS_DST));
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
exports.default = parallel(browserSync, watchCss, watchJs); // $ gulp
exports.clean = clean; // $ gulp clean
exports.css = buildStyles; // $ gulp css
exports.js = buildScripts; // $ gulp js
exports.watchCSS = watchCss; // $ gulp watch
exports.watchJS = watchJs; // $ gulp watch
exports.build = series(clean, buildStyles, buildScripts); // $ gulp build