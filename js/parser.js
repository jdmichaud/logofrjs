define(function() {
  'use strict';

  var PEG = require('pegjs');
  var visitor = require('pegjs/lib/compiler/visitor');
  var instruction = require('./instruction');
  var grammarFile = 'grammar/logo.peg';

  var eErrCode = {
    SYNTAX_ERROR: 1,
    UNKNOWN_INSTRUCTION: 2,
		MISSING_ARGUMENT: 3,
		USELESS_ARGUMENT: 4,
    UNKNOWN_ERROR: 255
  };

  return {
    // fs - filesystem
    // content - string containing the text to parse
    // debug - boolean indicating if pegjs shall output debugging information
    // returns the AST
    parse: function(fs, content, debug) {
      // No debug by default
      if (debug === undefined) { debug = false; }
      // Load the grammar
      var logoGrammar = fs.readFileSync(grammarFile, 'utf8').toString();
      // Build parser from grammar
      var parser = PEG.buildParser(logoGrammar, { trace: debug } );
      var ast;
      try {
        // Parse the file content
        ast = parser.parse(content);
      } catch(exception) {
        if (exception.name === 'SyntaxError') {
          var err = 'Erreur de syntaxe ligne ' + exception.location.start.line +
                    '! Trouvé: "' + exception.found + '"' +
                    ' mais on attendait: "' +
                    exception.expected[0].description + '"';
          return {err: err, errno: eErrCode.SYNTAX_ERROR, ast: {}};
        } else {
          return {err: exception, errno: eErrCode.UNKNOWN_ERROR, ast: {}};
        }
      }
      return {err: undefined, ast: ast};
    },
    // Analyze the AST to ensure the syntax is correct:
    // - Commands are known
    // - Arguments are properly formated
    // ast - the ast as return by pegjs parse function
    // returns the errCode and an error string
    syntaxCheck: function(ast) {
      // Build a custom visitor
      var check = visitor.build({
        PROGRAM: function(node) {
          for (var i = node.instructions.length - 1; i >= 0; i--) {
            var ret = check(node.instructions[i]);
            // If an error code is returned, stop immediatly and returns the
            // error
            if (ret.errno !== 0) {
              return ret;
            }
          };
          return { errno: 0, err: '' };
        },
        INSTRUCTION: function(node) {
					// Check for unknown instruction
          var matching = instruction.getMatchingInstruction(node.command);
          if (matching === undefined) {
            return { errno: eErrCode.UNKNOWN_INSTRUCTION,
                     err: 'Ligne ' + node.line + ': L\'instruction "' +
                                node.command + '" est inconnue' };
          }
					// Check an argument is present if necessary
					if (matching.haveArgs && !node.hasOwnProperty('arg')) {
						return { errno: eErrCode.MISSING_ARGUMENT,
										 err: 'Ligne ' + node.line + ': La command "' +
													 node.command + '" doit avoir un argument' };
					}
					// Check there is no argument if none expected
					if (!matching.haveArgs && node.hasOwnProperty('arg')) {
						return { errno: eErrCode.USELESS_ARGUMENT,
										 err: 'Ligne ' + node.line + ': La command "' +
													 node.command + '" ne doit pas avoir d\'argument' };
					}
          return { errno: 0, err: '' };
        },
        NOOP: function(node) { /* quietly ignored */
          return { errno: 0, err: '' };
        }
      });
      // Call the visitor with the provided ast
      return check(ast);
    }
  };
});
