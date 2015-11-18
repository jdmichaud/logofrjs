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
		fs.readFile(process.argv[1], 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			}
			console.log("parse ", process.argv[1]);
			// Parse the loaded file
			parser.parse(data);
		});
		console.log("do something with ", process.argv[1]);
	}
});
