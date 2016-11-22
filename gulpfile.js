var gulp = require('gulp');
var browserify = require('gulp-browserify');
var Server = require('karma').Server;
var jsdoc = require('gulp-jsdoc3');
var spawn = require('child_process').spawn;
var node;

/**
 * $ gulp
 * description: browserify client side
 */
gulp.task('browserify', function() {
  return gulp.
    src('./frontend/javascript/main.js').
    pipe(browserify()).
    pipe(gulp.dest('./frontend/bin'));
});

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('watch', function() {
  gulp.run('server');
  gulp.watch(['./frontend/javascript/*.js',
            './frontend/javascript/patterns/observer/*.js',
            './frontend/javascript/patterns/singleton/*.js',
            './frontend/javascript/controllers/*.js'],
             ['browserify'],function() {
                 gulp.run('server');
             });
});

/**
 * $ gulp
 * description: Launch tests once
 */

gulp.task('test', function (done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['backend/index.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

/**
 * $ gulp
 * description: Launch tests continously
 */

gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});

/**
 * $ gulp
 * description: Generate automatically all development documentation using jsdoc
 */

gulp.task('doc', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md','README_GIT', './frontend/javascript/**/*.js'], {read: false})
    //gulp.src(['./javascript/ball.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill();
});
