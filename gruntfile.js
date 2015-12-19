module.exports = function(grunt) {
  'use strict';

  var serveStatic = require('serve-static');
  var appConfig = {
      SERVER_PORT: 9042,
      LIVERELOAD_PORT: 35729
  };
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appConfig: appConfig,
    jshint: {
      file: {
        src: [
          'gruntfile.js',
          'app/js/**/*.js',
          'spec/**/*.js',
          '!spec/unit/requirejs-setup.js',
          '!spec/unit/requirejs-wrapper-template.js'
        ]
      },
      options: {
        multistr: true,
        esnext: true,
        jshintrc: '.jshintrc'
      }
    },
    wiredep : {
      app: {
        src: ['app/index.html'],
        dest: 'dist'
      }
    },
    concat: {
      dist: {
        // the files to concatenate
        src: ['app/js/**/*.js'],
        // the location of the resulting JS file
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';',
        // Setup a source map for easier debugging
        sourceMap: true
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': '<%= concat.dist.dest %>'
        },
        options: {
          sourceMap: true,
          sourceMapIn: '<%= concat.dist.dest %>.map'
        }
      }
    },
    requirejs: {
      dist: {
        options: {
          baseUrl: 'app/js/',
          out: 'dist/js/app.js',
          include: 'logofr',
          name: '../../node_modules/almond/almond',
          inlineText: true,
          findNestedDependencies: true,
          optimize: 'none',
          generateSourceMaps: true,
          preserveLicenseComments: false
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['app/index.html', 'grammar/logo.peg'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'app/',
            src: ['styles/**/*'],
            dest: 'dist/'
          }
        ]
      }
    },
    karma: {
      browser: {
        configFile: 'spec/browser/karma.conf.js'
      }
    },
    watch: {
      livereload: {
        files: [
          '<%= jshint.file.src %>',
          'app/**/*.html',
          'grammar/logo.peg'
        ],
        tasks: ['build'],
        options: {
          livereload: appConfig.LIVERELOAD_PORT
        }
      }
    },
    // The actual grunt server settings
    connect: {
      options: {
        port: appConfig.SERVER_PORT,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: appConfig.LIVERELOAD_PORT,
        debug: true
      },
      livereload: {
        options: {
          livereload: true,
          open: false,
          base: 'dist',
          keepalive: false,
          middleware: function(connect) {
            return [
              serveStatic('dist'),
              connect().use('/bower_components', serveStatic('./bower_components'))
            ];
          }
        }
      }
    },
    clean: { dist: [
      'dist',
    ]}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // uglify removed as not supporting ES6
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'wiredep',
    'concat',
    'requirejs',
    'copy'
  ]);
  grunt.registerTask('default', ['clean', 'jshint', 'wiredep']);
  grunt.registerTask('test', ['clean', 'jshint', 'karma']);
  grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);
};
