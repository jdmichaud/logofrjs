define(function() {
  'use strict';

  var PEG = require('pegjs');
  var grammarFile = 'grammar/logo.peg'

  var e_errCode = {
    SYNTAX_ERROR: 1,
    UNKNOWN_ERROR: 255
  };

  return {
    parse: function(fs, content, debug) {
      // No debug by default
      if (debug === undefined) debug = false;
      // Load the grammar
      var logoGrammar = fs.readFileSync(grammarFile, 'utf8').toString();
      // Build parser from grammar
      var parser = PEG.buildParser(logoGrammar, { trace: debug } );
      var ast;
      try {
        // Parse the file content
        ast = parser.parse(content);
      } catch(exception) {
        if (exception.name == 'SyntaxError') {
          var err = 'Erreur de syntaxe ligne ' + exception.location.start.line +
                    '! Trouvé: "' + exception.found + '"' +
                    ' mais on attendait: "' +
                    exception.expected[0].description + '"';
          return {err: err, errno: e_errCode.SYNTAX_ERROR, ast: {}};
        } else {
          return {err: exception, errno: e_errCode.UNKNOWN_ERROR, ast: {}};
        }
      }
      return {err: undefined, ast: ast};
    }
  };
});
