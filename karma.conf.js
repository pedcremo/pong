module.exports = function(config) {
  config.set({
    frameworks: ['jasmine-jquery','jasmine','browserify'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],

    files: [
      //'node_modules/socket.io-client/dist/socket.io.js',
      'node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js',
      'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
      'socket.io/socket.io.js',
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
