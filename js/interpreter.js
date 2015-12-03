// Jean-Daniel Michaud - 2015
//
// Interpret the ast and execute the logo program by issuing Mirobot commands

define(function() {
  'use strict';

  // * This function returns the object mapping the node type to the handler
  // functions and is passed to the visitor builder. This design is quite
  // intricated and limiting but is better than having to rethink it myself.
  // * This function is a closure as the mirobotService will be available to
  // the generated visit function
  // * Each method of the visit object takes a node and the visit function
  // itself for recursion.
  var interpretVisitor = function (mirobotService) {
    return {
      PROGRAM: function (node, visit) {
        for (var i = node.instructions.length - 1; i >= 0; i--) {
          var ret = visit(node.instructions[i]);
          // If an error code is returned, stop immediatly and returns the
          // error
          if (ret.errno !== 0) {
            return ret;
          }
        }
        return { errno: 0, err: '' };
      },
      INSTRUCTION: function (node, visit) {
        if (node.command == '')
        return { errno: 0, err: '' };
      },
      NOOP: function (node, visit) {
        return { errno: 0, err: '' };
      }
    };
  };

  return {
    // Interpret the logo file and send commands to the Mirobot
    // ast - the ast parsed and syntax checked
    // miroborConnection - the service used to send command to the mirobot
    interpret: function (visitor, ast, mirobotService) {
      // Build a custom visitor
      var interpretVisit = visitor.build( interpretVisitor(mirobotService) );
      // interpret the ast and issue the command
      interpretVisit(ast, interpretVisit);
    }
  };

});
