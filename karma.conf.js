module.exports = function(config) {
  config.set({
    frameworks: ['jasmine','browserify'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],

    files: [
      'frontend/bin/main.js',
      'tests/test.js'
    ],
    preprocessors: {
      'tests/**/*.js': [ 'browserify' ]
    },
    browserify:{
      debug: true
    }
  });
};
