define(['mirobot-adapter', 'interpreter', '../parser'],
        function (adapterFactory, interpreter, parser) {
  'use strict';

  var interpreterService = function InterpreterService(mirobotService) {
    // Create an adapter plugged to the websocket service
    var adapter = adapterFactory.createAdapter(mirobotService);
    return {
      interpret: function (content, logoGrammar) {
        // Parse the loaded file
        var parseRet = parser.parse(PEG, PEG.visitor, content, logoGrammar, false);
        if (parseRet.err) {
          // Error while walking the AST
          console.log(parseRet.err);
          return parseRet;
        } else {
          // Check the syntax of the parsed AST
          var syntaxCheckRet = parser.syntaxCheck(PEG.visitor, parseRet.ast);
          if (syntaxCheckRet.errno !== 0) {
            console.log('Error(' , syntaxCheckRet.errno, '): ',
                        syntaxCheckRet.err);
            return syntaxCheckRet;
          }
          // Normalize the AST
          parseRet.ast = parser.normalize(PEG.visitor, parseRet.ast);
          // Interpret the AST and issue mirobot command
          interpreter.interpret(PEG.visitor, adapter, parseRet.ast);
          return { errno: 0, err: '' };
        }
      }
    };
  };

  return interpreterService;
});
