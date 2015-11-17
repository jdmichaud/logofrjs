module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		jshint: {
			file: {
				src: ['js/**/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);
}
