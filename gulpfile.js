/* jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
    jscs = require('gulp-jscs'),
    git = require('gulp-git'),
    excludeGitIgnore = require('gulp-exclude-gitignore'),
    del = require('del'),
    karmaServer = require('karma').Server,
    runSequence = require('run-sequence'),
    map = require('map-stream'),
    argv = require('yargs').argv,
    spawn = require('child_process').spawn,
    fs = require('fs'),

    path = {
        root: ['*.js'],
        src: ['src/**/*.js'],
        tests: ['tests/**/*.js'],
        jsonFiles: ['bower.json', 'package.json']
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

gulp.task('release', function() {
    runSequence('build', 'bump', 'git:commit', 'git:tag', 'git:push', 'git:push:tags', 'publish');
});

gulp.task('bump', function(done) {
    if (argv.patch) {
        gulp.src(path.jsonFiles)
            .pipe(bump())
            .pipe(gulp.dest('./'))
            .on('end', done);
    } else if (argv.minor) {
        gulp.src(path.jsonFiles)
            .pipe(bump({type: 'minor'}))
            .pipe(gulp.dest('./'))
            .on('end', done);
    } else if (argv.major) {
        gulp.src(path.jsonFiles)
            .pipe(bump({type: 'major'}))
            .pipe(gulp.dest('./'))
            .on('end', done);
    } else {
        console.error('Need to specify a type for version bump (--patch|--minor|--major)');
    }
});

gulp.task('git:commit', function() {
    gulp.src('**/*')
        .pipe(excludeGitIgnore())
        .pipe(git.add())
        .pipe(git.commit('Release ' + getVersion()));
});

gulp.task('git:tag', function(done) {
    git.tag(getVersion(), 'Release ' + getVersion(), done);
});

gulp.task('git:push', function(done) {
    git.push('origin', 'master', done);
});

gulp.task('git:push:tags', function(done) {
    git.push('origin', 'master', {args: '--tags'}, done);
});

gulp.task('publish', function(done) {
    spawn('npm', ['publish'], {stdio: 'inherit'})
        .on('close', done);
});

function getVersion() {
    return 'v' + JSON.parse(fs.readFileSync('./package.json')).version;
}
