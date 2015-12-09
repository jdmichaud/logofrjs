module.exports = function(grunt) {
  'use strict';

  var serveStatic = require('serve-static');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      file: {
        src: [
          'gruntfile.js',
          'app/js/**/*.js',
          'spec/**/*.js'
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
          optimize: 'uglify'
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['app/index.html'],
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
      files: ['<%= jshint.file.src %>'],
      tasks: ['jshint']
    },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9042,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '3.249.251.56',
        livereload: 35729,
        debug: true
      },
      livereload: {
        options: {
          open: true,
        }
      },
      dist: {
        options: {
          open: false,
          base: 'dist',
          keepalive: true,
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
  grunt.registerTask('serve', ['build', 'connect:dist']);
};
