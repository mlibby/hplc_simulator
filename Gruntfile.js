module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      hplc: {
        src: ['src/js/manifest.js'],
        dest: 'src/js/browserified.js'
      },
    },
    
    clean: {
      js: ["dist/js/*.js"],
      css: ["dist/css/*"],
      html: ["dist/html/*"]
    },

    copy: {
      bowerJs: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-mocks/angular-mocks.js',
              '*/*.min.js',
              '**/dist/*.js'
             ],
        dest: 'src/js/libs/'
      },
      bowerCss: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['*/*.css', '**/dist/*.css', '**/dist/themes/*.css', '**/themes/*.css'],
        dest: 'src/css/libs/'
      },
      devHtml: {
        cwd: 'src/html',
        expand: true,
        flatten: true,
        src: ['**/*.html'],
        dest: 'dist/html/'
      },
      devCss: {
        expand: true,
        cwd: 'src/css',
        src: ['**/*.css'],
        dest: 'dist/css/'
      },
      devJs: {
        expand: true,
        cwd: 'src/js',
        src: ['browserified.js'],
        dest: 'dist/js/'
      },
      devIconCss: {
        src: 'src/material-design-icons/style.css',
        dest: 'dist/css/icons.css'
      },
      devIconFont: {
        flatten: true,
        expand: true,
        cwd: 'src/material-design-icons',
        src: 'fonts',
        dest: 'dist/css/'
      },
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      js: {
        src: 'dist/js/*.js'
      },
      css: {
        src: 'dist/css/*.css'
      }
    },

    uglify: {
      options: {
        mangle: false,
        compress: false,
        beautify: true
      }
    },

    cssMin: {
      options: {
      }
    },

    useminPrepare: {
      options: {
        dest: 'dist',
        root: '.'
      },
      html: 'dist/html/*.html'
    },

    usemin: {
      options: {
        blockReplacements: {
          js: function (block) {
            grunt.verbose.writeln('summary = ' + grunt.filerev.summary);
            dest = 'dist/' + block.dest;
            target = grunt.filerev.summary[dest].replace('dist/', '');
            return '<script src="' + target + '"></script>';
          },
          css: function (block) {
            grunt.verbose.writeln('summary = ' + grunt.filerev.summary);
            dest = 'dist/' + block.dest;
            target = grunt.filerev.summary[dest].replace('dist/', '');
            return "<link rel='stylesheet' href='" + target + "' type='text/css'>";
          }

        }
      },

      html: ['dist/html/index.html']
    },

    watch: {
      bowerJs: {
        files: 'bower_components/**/*.js}',
        tasks: ['copy:bowerJs']
      },

      bowerCss: {
        files: 'bower_components/**/*.css}',
        tasks: ['copy:bowerCss']
      },

      js: {
        files: 'src/js/**/*.js',
        tasks: ['copy:devJs']
      },

      css: {
        files: 'src/css/**/*.css',
        tasks: ['copy:devCss'],
      },

      tmpl: {
        files: 'src/html/tmpl/**/*.html',
        tasks: ['copy:devHtml']
      },

      html: {
        files: 'src/html/build/**/*.html',
        tasks: ['copy:devHtml']
      },

      iconCss: {
        files: 'src/material-design-icons/style.css',
        tasks: ['copy:devIconCss']
      },
      
      iconFont: {
        files: 'src/material-design-icons/fonts',
        tasks: ['copy:devIconFont']
      }
    },

    express: {
      dev: {
        options: {
          script: 'server/server.js',
          port: 5000
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('copy-build', [
    'copy:devCss',
//    'copy:devJs',
    'copy:devHtml',
    'copy:devIconCss',
    'copy:devIconFont'
  ]);

  grunt.registerTask('copy-dev', [
    'copy:bowerCss',
    'copy:bowerJs',
    'copy-build'
  ]);

  grunt.registerTask('tdd', [
    'clean',
    'copy-dev',
    'express:dev',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean',
    'browserify',
    'copy-dev',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'filerev',
    'usemin',
  ]);


  grunt.registerTask('default', ['tdd']);
};
