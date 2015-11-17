var PEG = require('pegjs');
var logoGrammar = require('logo-grammar').grammar

define(function() {
	'use strict';

	return {
		parse: function(content) {
			var parser = PEG.buildParser(logoGrammar);
			return parser.parse(content);
		}
	}
});
