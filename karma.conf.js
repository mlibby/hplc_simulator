module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/js/libs/jquery.min.js',
      'dist/js/libs/hammer.min.js',
      'dist/js/libs/angular.min.js',
      'dist/js/libs/angular-animate.min.js',
      'dist/js/libs/angular-aria.min.js',
      'dist/js/libs/angular-material.js',
      'dist/js/libs/angular-mocks.js',
      'dist/js/libs/angular-route.min.js',
      'src/js/app.js',
      'src/js/model/**/*.js',
      'src/js/ctrl/**/*.js',
      'src/html/**/*.html',
      'test/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
      '**/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/html/',
      moduleName: 'templates'
    },
    reporters: ['progress', 'html'],
    htmlReporter: {
      outputFile: 'test/test_results.html'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Firefox']
  });
};
