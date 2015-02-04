module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      hplc: {
        src: ['src/js/manifest.js'],
        dest: 'dist/dev/js/hplc.js'
      },
    },

    clean: {
      devCss: ["dist/dev/css/hplc.css"],
      devCssLibs: ["dist/dev/css/libs.css"],
      devFonts: ["dist/dev/css/fonts/*"],
      devHtml: ["dist/dev/html/*"],
      devJs: ["dist/dev/js/hplc.js"],
      devJsLibs: ["dist/dev/js/libs.js"],
      prodCss: ["dist/prod/css/*.css"],
      prodHtml: ["dist/prod/html/*.html"],
      prodJs: ["dist/prod/js/*.js"],
    },

    concat: {
      options: {
        separator: '\n;',
      },
      css: {
        src: ['src/css/*.css'],
        dest: 'dist/dev/css/hplc.css'
      },
      cssLibs: {
        src: [
          'bower_components/angular/angular-csp.css',
          'bower_components/angular-material/angular-material.min.css',
          'src/material-design-icons/style.css'
        ],
        dest: 'dist/dev/css/libs.css'
      },
      jsLibs: {
        src: [
          "bower_components/hammerjs/hammer.min.js",
          "bower_components/angular/angular.min.js",
          "bower_components/angular-route/angular-route.min.js",
          "bower_components/angular-aria/angular-aria.min.js",
          "bower_components/angular-animate/angular-animate.min.js",
          "bower_components/angular-material/angular-material.min.js",
          "bower_components/jquery/dist/jquery.min.js",
          "bower_components/d3/d3.min.js",
        ],
        dest: 'dist/dev/js/libs.js'
      }
    },

    copy: {
      devHtml: {
        cwd: 'src/html',
        expand: true,
        flatten: true,
        src: ['**/*.html'],
        dest: 'dist/dev/html/'
      },
      devFonts: {
        flatten: true,
        expand: true,
        cwd: 'src/material-design-icons',
        src: 'fonts',
        dest: 'dist/dev/css/'
      },
      prodCss: {
        flatten: true,
        expand: true,
        cwd: 'dist/dev/css',
        src: '*.css',
        dest: 'dist/prod/css/'
      },
      prodFonts: {
        flatten: true,
        expand: true,
        cwd: 'dist/dev/css/fonts',
        src: '*',
        dest: 'dist/prod/css/fonts'
      },
      prodHtml: {
        flatten: true,
        expand: true,
        cwd: 'dist/dev/html',
        src: '*.html',
        dest: 'dist/prod/html/'
      },
      prodJsLibs: {
        flatten: true,
        expand: true,
        cwd: 'dist/dev/js',
        src: 'libs.js',
        dest: 'dist/prod/js/'
      }
    },

    cssMin: {
      options: {
      }
    },

    express: {
      dev: {
        options: {
          script: 'server/server.js',
          port: 5000,
          node_env: 'dev'
        }
      }
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      prod: {
        src: 'dist/prod/**/*.*',
      }
    },

    jasmine: {
      hplc: {
        src: 'dist/dev/js/hplc.js',
        options: {
          vendor: 'dist/dev/js/libs.js',
          specs: 'spec/*_spec.js',
          helpers: 'spec/helpers/*.js'
        }
      }
    },

    ngtemplates: {
      hplcSimulator: {
        cwd: 'src/html/tmpl',
        src: '*.html',
        dest: 'dist/prod/js/templates.js',
        options: {
          prefix: '/html/',
        },
      },
    },

    uglify: {
      options: {
        mangle: false,
        compress: true,
        beautify: false
      },
      js: {
        src: 'dist/dev/js/hplc.js',
        dest: 'dist/prod/js/hplc.js'
      }
    },

    watch: {
      css: {
        files: 'src/css/**/*.css',
        tasks: ['build-dev-css'],
      },

      cssLibs: {
        files: [
          'bower_components/**/*.css}',
          'src/material-design-icons/style.css'
        ],
        tasks: ['build-dev-css-libs']
      },

      fonts: {
        files: 'src/material-design-icons/fonts',
        tasks: ['build-dev-fonts']
      },

      html: {
        files: 'src/html/**/*.html',
        tasks: ['build-dev-html']
      },

      js: {
        files: 'src/js/**/*.js',
        tasks: ['build-dev-js', 'jasmine']
      },

      jsLibs: {
        files: 'bower_components/**/*.js}',
        tasks: ['build-dev-js-libs', 'jasmine']
      },

      spec: {
        files: 'spec/**/*.js',
        tasks: ['jasmine']
      },
    },

  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('use-rev', "replace css/js file references with revved file names", function () {
    var indexFiles = grunt.file.expand("dist/prod/html/index.*.html");
    var index = grunt.file.read(indexFiles[0]);
    
    var jsLinks = index.match(/js\/.+\.js/gi);
    for(var x in jsLinks) {
      var js = jsLinks[x];
      var revJs = grunt.filerev.summary['dist/prod/' + js].match(/js\/.+\.js/)[0];
      index = index.replace(js, revJs);
      grunt.verbose.writeln(js + " => " + revJs);
    }

    var cssLinks = index.match(/css\/.+\.css/gi);
    for(var x in cssLinks) {
      var css = cssLinks[x];
      var revCss = grunt.filerev.summary['dist/prod/' + css].match(/css\/.+\.css/)[0];
      index = index.replace(css, revCss);
      grunt.verbose.writeln(css + " => " + revCss);
    }

    grunt.file.write(indexFiles[0], index);
  });

  grunt.registerTask('rev-prod', ['filerev', 'use-rev']);

  grunt.registerTask('build-dev-css', ['clean:devCss', 'concat:css']);

  grunt.registerTask('build-dev-css-libs', ['clean:devCssLibs', 'concat:cssLibs']);

  grunt.registerTask('build-dev-fonts', ['clean:devFonts', 'copy:devFonts']);

  grunt.registerTask('build-dev-html', ['clean:devHtml', 'copy:devHtml']);

  grunt.registerTask('build-dev-js', ['clean:devJs', 'browserify']);

  grunt.registerTask('build-dev-js-libs', ['clean:devJsLibs', 'concat:jsLibs']);

  grunt.registerTask('build-dev', [
    'build-dev-css',
    'build-dev-css-libs',
    'build-dev-fonts',
    'build-dev-html',
    'build-dev-js',
    'build-dev-js-libs',
  ]);

  grunt.registerTask('build-prod-js', [
    'clean:devJs',
    'clean:prodJs',
    'browserify',
    'uglify',
    'copy:prodJsLibs'
  ]);
  
  grunt.registerTask('build-prod', [
    'build-dev',
    'build-prod-js',
    'clean:prodCss',
    'copy:prodCss',
    'copy:prodFonts',
    'clean:prodHtml',
    'copy:prodHtml',
    'ngtemplates',
    'rev-prod',
  ]);
  
  grunt.registerTask('tdd', [
    'build-dev',
    'express:dev',
    'watch',
  ]);
  
  grunt.registerTask('default', ['tdd']);
};
