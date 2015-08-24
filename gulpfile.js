'use strict'

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    jshint = require('gulp-jshint'),

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

gulp.task('test', function(done) {
    new karmaServer({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('karmaWatch', function(done) {
    new karmaServer({
        configFile: __dirname + '/tests/karma.conf.js'
    }, done).start();
});
