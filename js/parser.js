var PEG = require('pegjs');
var logoGrammar = require('./logo-grammar').grammar;

define(function() {
  'use strict';

  return {
    parse: function(content, debug) {
      if (debug === undefined) debug = false;
      var parser = PEG.buildParser(logoGrammar, { trace: debug } );
      var ast;
      try {
        ast = parser.parse(content);
      } catch(exception) {
        if (exception.name == 'SyntaxError') {
          var err = 'Erreur de syntaxe ligne ' + exception.location.start.line +
                    '! Trouvé: "' + exception.found + '"' +
                    ' mais on attendait: "' +
                    exception.expected[0].description + '"';
          return {err: err, ast: {}};
        } else {
          throw exception;
        }
      }
      return {err: undefine, ast: ast};
    }
  };
});
