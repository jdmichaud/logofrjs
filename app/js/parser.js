define(['instruction'], function(instruction) {
//define(function() {
  'use strict';

//  var PEG = require('pegjs');
//  var visitor = require('pegjs/lib/compiler/visitor');

  var eErrCode = {
    SYNTAX_ERROR: 1,
    UNKNOWN_INSTRUCTION: 2,
    MISSING_ARGUMENT: 3,
    USELESS_ARGUMENT: 4,
    REPEAT_LOOP_WO_ARG: 5,
    UNKNOWN_ERROR: 255
  };

  return {
    // content - string containing the text to parse
    // debug - boolean indicating if pegjs shall output debugging information
    // returns the AST
    parse: function(PEG, visitor, content, logoGrammar, debug) {
      // No debug by default
      if (debug === undefined) { debug = false; }
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
      return {errno: 0, err: undefined, ast: ast};
    },

    // Analyze the AST to ensure the syntax is correct:
    // - Commands are known
    // - Arguments are properly formated
    // visit - the pegjs visit module
    // ast - the ast as return by pegjs parse function
    // returns the errCode and an error string
    syntaxCheck: function(visitor, ast) {
      // Build a custom visitor
      var check = visitor.build({
        PROGRAM: function(node) {
          for (var i = 0; i < node.instructions.length; i++) {
            var ret = check(node.instructions[i]);
            // If an error code is returned, stop immediatly and returns the
            // error
            if (ret.errno !== 0) {
              return ret;
            }
          }
          return { errno: 0, err: '' };
        },
        INSTRUCTION: function(node) {
          // Check for REPETE keyword with no argument
          if (node.command === 'REPETE') {
            return { errno: eErrCode.REPEAT_LOOP_WO_ARG,
                     err: 'Ligne ' + node.line +
                       ': Vous devez indiquer un nombre d\'iterations a REPETE' };
          }
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
        },
        REPEAT: function(node) { /* quietly ignored */
          return { errno: 0, err: '' };
        },
        LIST: function(node) { /* quietly ignored */
          return { errno: 0, err: '' };
        }
      });
      // Call the visitor with the provided ast
      return check(ast);
    },

    // Normalize the command name to simplify the interpreter. All commands are
    // transformed to their capitalized full named form.
    // NOOP commands are removed.
    // visit - the pegjs visit module
    // ast - the ast as return by pegjs parse function
    // returns an errcode and the normalized AST
    normalize: function (visitor, ast) {
      // Build a custom visitor
      var normalizeVisit = visitor.build({
        PROGRAM: function(node) {
          var normedInstructions = [];
          for (var i = 0; i < node.instructions.length; i++) {
            var instruction = normalizeVisit(node.instructions[i]);
            // filter out NOOP node
            if (instruction.type !== 'NOOP') {
              normedInstructions.push(instruction);
            }
          }
          node.instructions = normedInstructions;
          return node;
        },
        INSTRUCTION: function(node) {
          // Check for unknown instruction
          var matching = instruction.getMatchingInstruction(node.command);
          // Use the capitalized fully named command label (the first one)
          node.command = matching.labels[0];
          return node;
        },
        NOOP: function(node) { /* quietly ignored */
          return node;
        },
        REPEAT: function(node) { /* quietly ignored */
          node.instruction = normalizeVisit(node.instruction);
          return node;
        },
        LIST: function(node) { /* quietly ignored */
          var normedInstructions = [];
          for (var i = 0; i < node.instructions.length; i++) {
            var instruction = normalizeVisit(node.instructions[i]);
            // filter out NOOP node
            if (instruction.type !== 'NOOP') {
              normedInstructions.push(instruction);
            }
          }
          node.instructions = normedInstructions;
          return node;
        }
      });
      // Call the visitor with the provided ast
      return normalizeVisit(ast);
    }
  };
});
