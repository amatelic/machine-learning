'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');

var look = './algorithms/naivebayes/sass/app.sass';
var des = './algorithms/naivebayes/public';
var wt = './algorithms/naivebayes/sass/**/*.sass';

gulp.task('sass', function() {
  return gulp.src(look)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(des));
});

gulp.task('sass:watch', function() {
  gulp.watch(wt, ['sass']);
});
