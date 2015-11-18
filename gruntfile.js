module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			file: {
				src: ['js/**/*.js']
			},
			options: {
				multistr: true,
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
					baseUrl: 'js',
					out: 'dist/js/app.js',
					include: 'logofr'
				}
			}
		},
		watch: {
			files: ['<%= jshint.file.src %>'],
			tasks: ['jshint']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['jshint', 'uglify', 'requirejs']);
}
