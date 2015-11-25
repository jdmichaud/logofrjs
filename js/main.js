// Jean-Daniel Michaud - 2015
//
// This file is the main entry point of the logofrjs node application.
// The node application is to be run in node as a standalone script. It will
// parse the file passed as parameter and interpret it as a french LOGO program.
// TODO: explain the mirobot part

var requirejs = require('requirejs');

requirejs.config({
  //Pass the top-level main.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});

// Main function
requirejs(['fs', 'commander', '../package.json', 'parser'],
          function (fs, program, pjson, parser) {
  'use strict';
  // Help usage function
  var usage = function usage() {
    console.log('usage: node logofrjs [--debug,-d] <logofile>');
  };
  // Take a filename, load the file and execute the logo program
  var runFile = function(filename, fs, parser, debug) {
    var content;
    try {
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
    var parseRet = parser.parse(fs, content, debug);
    if (parseRet.err) {
      // Error while walking the AST
      console.log(parseRet.err);
      return parseRet.errno;
    } else {
      // TODO: do something with this AST
      var syntaxCheckRet = parser.syntaxCheck(parseRet.ast);
      if (syntaxCheckRet.errCode !== 0) {
        console.log(syntaxCheckRet.err);
        return syntaxCheckRet.errno;
      }
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
      runFile(filename, fs, parser, program.debug);
    }
  }
});
