/* jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    karmaServer = require('karma').Server,
    runSequence = require('run-sequence'),
    map = require('map-stream'),

    path = {
        root: ['*.js'],
        src: ['src/**/*.js'],
        tests: ['tests/**/*.js']
    },

    exitOnJshintError = map(function(file, cb) {
        if (!file.jshint.success) {
            console.error('jshint failed');
            process.exit(1);
        }

        cb();
    });

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('build', function(done) {
    runSequence('lint', 'test', 'clean', 'dist', done);
});

gulp.task('dist', function() {
    gulp.src(path.src)
        .pipe(concat('angular-br-formatter.js'))
        .pipe(gulp.dest('dist')) // output non-minified version

        .pipe(uglify()) // output minified version
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
    gulp.src(path.root.concat(path.src.concat(path.tests)))
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(exitOnJshintError);
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
