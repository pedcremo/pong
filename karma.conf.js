module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'frontend/bin/main.js',
      'tests/test.js'
    ]
  });
};
