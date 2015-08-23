'use strict'

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del'),

    path = {
        src: ['src/**/*.js']
    };

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('build', ['clean'], function() {
    gulp.src(path.src)
        .pipe(concat('angular-br-formatter.js'))
        .pipe(gulp.dest('dist')) // output non-minified version

        .pipe(uglify()) // output minified version
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

