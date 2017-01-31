'use strict';

const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

const buildDir = './build';

gulp.task('clean', cb => {
  return del(['./spec/app/', buildDir], cb);
});

gulp.task('copy', ['clean'], function () {
  return gulp.src(['./src/**/*', './package.json', './README.md', 'LICENSE', '!./src/!(redux)*.js'])
    .pipe(gulp.dest(buildDir));
});

gulp.task('js-compile', ['clean'], function () {
  return gulp.src(['./src/**/!(redux)*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest(buildDir));
});

gulp.task('default', ['clean', 'js-compile', 'copy']);