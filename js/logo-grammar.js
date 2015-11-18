// Jean-Daniel Michaud - 2015
//
// This module contains the PEG.js grammar of the french version of LOGO

define(function() {

	var astTypeEnum = {
		INSTRUCTION: 0,
		PROGRAM: 1
	};

	return {
		grammar: '\
			keyword = [A-Za-z]+ \
			integer = [0-9]+ \
			// Matches single-line comments \
			comment = "//" (!lb .)* \
			ws = [ \t ] // Whitespaces \
			// Matches any number of whitespace/comments in a row \
			_  = (ws / comment)* \
			// newlines are our only instruction separator \
			newline = [\n\r] \
			// Define what is an instruction \
			instruction "instruction" = k:keyword newline | k:keyword digits:integer newline { \
				type: astTypeEnum.INSTRUCTION, \
	 			command: k.join(""), \
				arg: parseInt(digits.join(""), 10) \
			} \
			program "program" = instructions * { \
				type: astTypeEnum.PROGRAM, \
				instrutions: instructions \
 			} \
		'
	};
});
