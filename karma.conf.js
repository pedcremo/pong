module.exports = function(config) {
  config.set({
    frameworks: ['jasmine-jquery','jasmine','browserify'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],

    files: [
      'node_modules/socket.io-client/socket.io.js',
      'frontend/bin/main.js',
      'tests/**/*.js'
    ],
    preprocessors: {
      'tests/**/*.js': [ 'browserify' ]
    },
    browserify:{
      debug: true
    }
  });
};
