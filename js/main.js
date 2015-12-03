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
requirejs(['fs', 'commander', '../package.json', 'parser', 'pegjs',
           'pegjs/lib/compiler/visitor'],
          function (fs, program, pjson, parser, PEG, visitor) {
  'use strict';
  // The french logo grammar file
  var grammarFile = 'grammar/logo.peg';

  // Help usage function
  var usage = function usage() {
    console.log('usage: node logofrjs [--debug,-d] <logofile>');
  };

  // Take a filename, load the file and execute the logo program
  var runFile = function(filename, fs, parser, PEG, visitor, debug) {
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
    console.log('parse', filename);
    // Parse the loaded file
    var parseRet = parser.parse(fs, PEG, visitor, content, logoGrammar, debug);
    if (parseRet.err) {
      // Error while walking the AST
      console.log(parseRet.err);
      return parseRet.errno;
    } else {
      // Check the syntax of the parsed AST
      var syntaxCheckRet = parser.syntaxCheck(visitor, parseRet.ast);
      if (syntaxCheckRet.errno !== 0) {
        console.log('Error(' , syntaxCheckRet.errno, '): ', syntaxCheckRet.err);
        return syntaxCheckRet.errno;
      }
      // Normalize the AST
      parseRet.ast = parser.normalize(visitor, parseRet.ast);
      console.log(util.inspect(parseRet, {showHidden: false, depth: null}));
      // Interpret the AST and issue mirobot command
      // TODO: interpreter.interpret(parseRes.ast);
      return 0;
    }
  };

  // Describe the program options
  program
    .version(pjson.version)
    .option('-d, --debug', 'Debug grammar')
    .parse(process.argv);
  // Check number of arguments
  if (process.argv.length !== 3 &&
      (process.argv.length !== 4 && program.debug)) {
    usage();
  } else {
    // Read files passed as parameter and interpret them
    for (let filename of program.args) {
      runFile(filename, fs, parser, PEG, visitor, program.debug);
    }
  }
});
