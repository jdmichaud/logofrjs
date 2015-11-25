define(function() {
  'use strict';

  var PEG = require('pegjs');
  var visitor = require('pegjs/lib/compiler/visitor');
  var grammarFile = 'grammar/logo.peg';

  var errCode = {
    SYNTAX_ERROR: 1,
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
          return {err: err, errno: errCode.SYNTAX_ERROR, ast: {}};
        } else {
          return {err: exception, errno: errCode.UNKNOWN_ERROR, ast: {}};
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
          console.log('PROGRAM');
          check(node.instructions);
          return { errCode: 0, errString: '' };
        },
        INSTRUCTION: function(node) {
          console.log('INSTRUCTION');
          return { errCode: 0, errString: '' };
        }
      });
      // Call the visitor with the provided ast
      return check(ast);
    }
  };
});
