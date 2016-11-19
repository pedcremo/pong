var gulp = require('gulp');
var browserify = require('gulp-browserify');
var Server = require('karma').Server;
var jsdoc = require('gulp-jsdoc3');


gulp.task('browserify', function() {
  return gulp.
    src('./javascript/main.js').
    pipe(browserify()).
    pipe(gulp.dest('./bin'));
});

gulp.task('watch', function() {
  gulp.watch(['./javascript/*.js',
            './javascript/patterns/observer/*.js',
            './javascript/patterns/singleton/*.js',
            './javascript/controllers/*.js'],
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
    gulp.src(['README.md','README_GIT', './javascript/**/*.js'], {read: false})
    //gulp.src(['./javascript/ball.js'], {read: false})
        .pipe(jsdoc(config, cb));
});
