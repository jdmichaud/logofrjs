module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      file: {
        src: [
          'gruntfile.js',
          'js/**/*.js',
          '!js/logo-grammar.js' // jshint does not manage template string yet
        ]
      },
      options: {
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
      },
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
    peg: {
      options: { trackLineAndColumn: true  },
      example : {
        src: "grammar/logo.peg",
        dest: "js/logo.js",
        options: {
          wrapper: function (src, parser) {
            return 'define("logo-grammar", [], function () { return ' + parser + ';  });';
          }
        }
      }
    },
    watch: {
      files: ['<%= jshint.file.src %>'],
      tasks: ['jshint']
    },
    clean: { dist: [
      'dist',
      'js/logo.js'
    ]}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-peg');

  grunt.registerTask('default', ['clean', 'jshint', 'peg']);
  //grunt.registerTask('default', ['jshint', 'requirejs']);
}
