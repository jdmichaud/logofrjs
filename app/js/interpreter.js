// Jean-Daniel Michaud - 2015
//
// Interpret the ast and execute the logo program by issuing Mirobot commands

define(function() {
  'use strict';

  // * This function returns the object mapping the node type to the handler
  // functions and is passed to the visitor builder. This design is quite
  // intricated and limiting but is better than having to rethink it myself.
  // * This function is a closure as the mirobotAdapter will be available to
  // the generated visit function
  // * Each method of the visit object takes a node and the visit function
  // itself for recursion.
  var interpretVisitor = function (mirobotAdapter) {
    return {
      PROGRAM: function (node, visit) {
        for (var i = 0; i < node.instructions.length; i++) {
          var ret = visit(node.instructions[i], visit);
        }
        return { errno: 0, err: '' };
      },
      INSTRUCTION: function (node, visit) {
        if (node.command === 'AVANCE') {
          mirobotAdapter.avance(node.arg);
        }
        else if (node.command === 'RECULE') {
          mirobotAdapter.recule(node.arg);
        }
        else if (node.command === 'TOURNEDROITE') {
          mirobotAdapter.tournedroite(node.arg);
        }
        else if (node.command === 'TOURNEGAUCHE') {
          mirobotAdapter.tournegauche(node.arg);
        }
        else if (node.command === 'LEVECRAYON') {
          mirobotAdapter.levecrayon();
        }
        else if (node.command === 'BAISSECRAYON') {
          mirobotAdapter.baissecrayon();
        }
      },
      NOOP: function (node, visit) {
        // NOOP ignored if any
      },
      REPEAT: function (node, visit) {
        var i;
        for (i = 0; i < node.iteration; ++i) {
          visit(node.instruction, visit);
        }
      },
      LIST: function (node, visit) {
        var i;
        for (i = 0; i < node.instructions.length; ++i) {
          visit(node.instructions[i], visit);
        }
      }
    };
  };

  return {
    // Interpret the logo file and send commands to the Mirobot
    // ast - the ast parsed and syntax checked
    // miroborConnection - the service used to send command to the mirobot
    interpret: function (visitor, mirobotAdapter, ast) {
      // Build a custom visitor
      var interpretVisit = visitor.build( interpretVisitor(mirobotAdapter) );
      // interpret the ast and issue the command
      interpretVisit(ast, interpretVisit);
    }
  };

});
