module.exports = function(config) {
  config.set({
    frameworks: ['jasmine-jquery','jasmine','browserify'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],

    files: [
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
