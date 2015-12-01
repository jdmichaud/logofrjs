module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      file: {
        src: [
          'gruntfile.js',
          'js/**/*.js',
          'test/**/*.js'
        ]
      },
      options: {
        multistr: true,
        esnext: true,
        jshintrc: '.jshintrc'
      }
    },
    concat: {
      dist: {
        // the files to concatenate
        src: ['js/**/*.js'],
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
    browserify: {
      dist: {
        files: {
          'dist/js/index.js': [
            'js/**/*.js',
            '!js/main.js'
          ]
        }
      },
      dev: {
        files: {
          'dist/js/index.js': [
            'js/**/*.js',
            '!js/main.js'
          ]
        },
        option: {
          browserifyOptions: {
            debug: true
          }
        }
      }
    },
    requirejs: {
      dist: {
        options: {
          baseUrl: '.',
          out: 'dist/js/app.js',
          include: 'js/logofr',
          name: 'node_modules/almond/almond',
          inlineText: true,
          findNestedDependencies: true,
          optimize: 'ulgify'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },
    watch: {
      files: ['<%= jshint.file.src %>'],
      tasks: ['jshint']
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
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'jshint']);
  //grunt.registerTask('default', ['jshint', 'requirejs']);
  grunt.registerTask('test', ['clean', 'jshint', 'browserify:dev', 'karma']);
};
