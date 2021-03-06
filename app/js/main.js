// Jean-Daniel Michaud - 2015
//
// This file is the main entry point of the logofrjs node application.
// The node application is to be run in node as a standalone script. It will
// parse the file passed as parameter and interpret it as a french LOGO program.
// TODO: explain the mirobot part

var requirejs = require('requirejs');
var util = require('util');

requirejs.config({
  //Pass the top-level main.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});

// Main function
requirejs(['fs', 'ws', 'commander', '../../package.json', 'parser',
           'mirobot-adapter', 'interpreter', 'pegjs',
           'pegjs/lib/compiler/visitor', 'mirobot-service'],
          function (fs, ws, program, pjson, parser, adapterFactory, interpreter,
                    PEG, visitor, mirobotService) {
  'use strict';
  // The french logo grammar file
  var grammarFile = 'grammar/logo.peg';

  // Help usage function
  var usage = function usage() {
    console.log('usage: node logofrjs [--debug,-d] <logofile> <mirobot\'s IP>');
  };

  // Take a filename, load the file and execute the logo program
  var runFile = function(filename, fs, parser, adapter, interpreter,
                         PEG, visitor, debug, displayAst, displayNormalizedAst) {
    var content;
    var logoGrammar;
    try {
      // Load the grammar
      logoGrammar = fs.readFileSync(grammarFile, 'utf8').toString();
      // Read the file
      content = fs.readFileSync(filename, 'utf8').toString();
    } catch (err) {
      if (err) {
        if (err.errno === -2) {
          return console.log('Le fichier', err.path, 'n\'existe pas');
        }
        // Manage here non translated errors
        return console.log(err);
      }
    }
    console.log(filename);
    // Parse the loaded file
    var parseRet = parser.parse(PEG, visitor, content, logoGrammar, debug);
    if (parseRet.err) {
      // Error while walking the AST
      console.log(parseRet.err);
      return parseRet.errno;
    } else {
      // Display the AST if requested
      if (displayAst) {
        console.log(util.inspect(parseRet.ast, {showHidden: false, depth: null}));
      }
      // Check the syntax of the parsed AST
      var syntaxCheckRet = parser.syntaxCheck(visitor, parseRet.ast);
      if (syntaxCheckRet.errno !== 0) {
        console.log('Error(' , syntaxCheckRet.errno, '): ', syntaxCheckRet.err);
        return syntaxCheckRet.errno;
      }
      // Normalize the AST
      parseRet.ast = parser.normalize(visitor, parseRet.ast);
      if (displayNormalizedAst) {
        console.log(util.inspect(parseRet.ast, {showHidden: false, depth: null}));
      }
      // Interpret the AST and issue mirobot command
      interpreter.interpret(visitor, adapter, parseRet.ast);
      return 0;
    }
  };

  var onWebSocketConnection = function (program) {
    // Create an adapter plugged to the websocket service
    var adapter = adapterFactory.createAdapter(mirobotService);
    // Read files passed as parameter and interpret them
    for (let filename of program.args.slice(0, program.args.length - 1)) {
      let ret = runFile(filename, fs, parser, adapter, interpreter,
                        PEG, visitor, program.debug, program.displayAst,
                        program.displayNormalizedAst);
      if (ret !== 0) {
        return ret;
      }
    }
    return 0;
  };

  // Describe the program options
  program
    .version(pjson.version)
    .option('-d, --debug', 'Debug grammar')
    .option('-a, --display-ast', 'Display the resulting AST after parsing')
    .option('-n, --display-normalized-ast', 'Display the normalized AST')
    .parse(process.argv);
  // Check number of argumentsi
  if (program.args.length < 2) {
    usage();
  } else {
    GLOBAL.WebSocket = ws;
    // Connect to the mirobot web service
    var mirobotIP = program.args.slice(program.args.length - 1);
    mirobotService.connect(mirobotIP, 8899, function () {
                             // On connection, execute the files
                             if (onWebSocketConnection(program) === 0) {
                               // Close the wesocket connections once all requests
                               // have been processed by mirobot
                               mirobotService.close(true);
                             } else {
                               // Force close on error
                               mirobotService.close(false);
                             }
                           }, function () {
                             console.log('Program terminated.');
                           }, function (err) {
                             console.log('Error: ', err);
                           },
                           'websocket');
  }
});
