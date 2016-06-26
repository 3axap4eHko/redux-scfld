'use strict';

const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

gulp.task('clean', cb => {
    return del(['./dist/**/*', './bin/redux.js', './spec/app/'], cb);
});

gulp.task('copy', ['clean'], function() {
    return gulp.src(['./src/**/*', '!./src/*.js'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('js-compile', ['clean'], function() {
    return gulp.src(['./src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js-compile-bin', ['clean'], function() {
    return gulp.src(['./bin-src/redux.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest('./bin'));
});

gulp.task('default', ['clean', 'js-compile', 'copy', 'js-compile-bin']);