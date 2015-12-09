// Jean-Daniel Michaud - 2015
//
// Main entry point for logofrjs in the Browser

require(['pegjs', './mirobot-service', 'mirobot-adapter', 'interpreter', './parser'],
        function(PEG, mirobotService, adapterFactory, interpreter, parser) {
  'use strict';

  var httpGetAsync = function (theUrl, callback, errorcb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        errorcb(xmlHttp.status);
      }
    };
    xmlHttp.open('GET', theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  };

  httpGetAsync('/logo.peg', function () {
    console.log('Ready to parse');
    angular.module('turtleApp').factory('MirobotService', function () { return mirobotService; });
    angular.module('turtleApp').factory('InterpreterService', function () {
      // Create an adapter plugged to the websocket service
      var adapter = adapterFactory.createAdapter(mirobotService);
      return {
        interpret: function (program) {
          // Parse the loaded file
          var parseRet = parser.parse(fs, PEG, PEG.visitor, content, logoGrammar, debug);
          if (parseRet.err) {
            // Error while walking the AST
            console.log(parseRet.err);
            return parseRet;
          } else {
            // Check the syntax of the parsed AST
            var syntaxCheckRet = parser.syntaxCheck(PEG.visitor, parseRet.ast);
            if (syntaxCheckRet.errno !== 0) {
              console.log('Error(' , syntaxCheckRet.errno, '): ', syntaxCheckRet.err);
              return syntaxCheckRet;
            }
            // Normalize the AST
            parseRet.ast = parser.normalize(PEG.visitor, parseRet.ast);
            // Interpret the AST and issue mirobot command
            interpreter.interpret(PEG.visitor, adapter, parseRet.ast);
            return { errno: 0, err: '' };
          }
        }
      }
    });
  }, function () {
    console.log('Could not load the logo grammar file');
    alert('Un probleme est survenu lors du chargement de la page');
  });

});
