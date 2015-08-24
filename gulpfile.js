'use strict';

// Gulp requires.
var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  arg = require('yargs').argv,
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload;

// BrowserSync.
gulp.task('browsersync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("*.html").on('change', reload);
  gulp.watch("js/*.js").on('change', reload);
  gulp.watch("sass/**/*.scss").on('change', reload);
});

// Using Node Sass (LibSass) to compile Sass.
gulp.task('sass', function() {
  gulp.src('sass/base.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
    // Optionally produce production CSS with $ gulp sass --production.
    .pipe($.if(!arg.production, $.sourcemaps.write('./')))
    .pipe($.if(arg.production, $.minifyCss()))
    .pipe(gulp.dest('css'));
});

// SCSS lint.
gulp.task('scss-lint', function() {
  gulp.src('sass/**/*.scss')
    .pipe($.cached($.scssLint))
    .pipe($.scssLint({
      'config': 'scss-lint.yml'
    }));
});

// Default - initial compile.
gulp.task('default', ['sass', 'scss-lint'], function() {
});

// Watch Sass - compile to CSS.
gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass', 'scss-lint']);
});

// Run BrowserSync.
gulp.task('sync', ['sass', 'watch', 'browsersync'], function() {
});
