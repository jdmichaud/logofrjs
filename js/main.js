// Jean-Daniel Michaud - 2015
//
// This file is the main entry point of the logofrjs node application.
// The node application is to be run in node as a standalone script. It will
// parse the file passed as parameter and interpret it as a french LOGO program.
// TODO: explain the mirobot part

var requirejs = require('requirejs');

requirejs.config({
	//Pass the top-level main.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	nodeRequire: require
});

requirejs(['fs', 'parser'], function (fs, parser) {
	'use strict';

	var usage = function usage() {
		console.log("usage: node logofrjs <logofile>");
	};

	// Check number of argument
	if (process.argv.length != 3) {
		usage();
	} else {
		// Read file passed as parameter 
		fs.readFile(process.argv[2], 'utf8', function (err, data) {
			if (err) {
				if (err.errno === -2) {
					return console.log("Le fichier", err.path, "n'existe pas");
				} else {
					return console.log(err);
				}
			}
			console.log("parse", process.argv[2]);
			// Parse the loaded file
			parser.parse(data);
		});
	}
});
