module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'bin/main.js',
      'tests/test.js'
    ]
  });
};
