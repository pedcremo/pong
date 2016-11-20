var gulp = require('gulp');
var browserify = require('gulp-browserify');
var Server = require('karma').Server;
var jsdoc = require('gulp-jsdoc3');


gulp.task('browserify', function() {
  return gulp.
    src('./frontend/javascript/main.js').
    pipe(browserify()).
    pipe(gulp.dest('./frontend/bin'));
});

gulp.task('watch', function() {
  gulp.watch(['./frontend/javascript/*.js',
            './frontend/javascript/patterns/observer/*.js',
            './frontend/javascript/patterns/singleton/*.js',
            './frontend/javascript/controllers/*.js'],
             ['browserify']);
});

gulp.task('test', function (done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});

gulp.task('doc', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md','README_GIT', './frontend/javascript/**/*.js'], {read: false})
    //gulp.src(['./javascript/ball.js'], {read: false})
        .pipe(jsdoc(config, cb));
});
