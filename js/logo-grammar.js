// Jean-Daniel Michaud - 2015
//
// This module contains the PEG.js grammar of the french version of LOGO

define(function() {

  var astTypeEnum = {
    INSTRUCTION: 0,
    PROGRAM: 1
  };

  return {
    grammar:
`
program "program" =
  ( instruction ) * {
    return {
      type: "PROGRAM",
      instrutions: i
    };
  }

keyword =
  [A-Za-z]+

integer =
  [0-9]+

// Whitespaces
ws =
  [ \\t  ]

// Matches any number of whitespace/comments in a row
_  =
  (ws)*

// newlines are our only instruction separator
newline =
  [\\n\\r\\u2028\\u2029]

sourceCharacter
  = .

comment
  = "//" (!newline sourceCharacter)*

// Define what is an instruction
instruction "instruction" =
   k:keyword _ digits:integer _ newline?
  / k:keyword _ newline?
  / comment _ newline?
  / _ newline {
    return {
      type: "INSTRUCTION",
      command: k.join(""),
      arg: parseInt(digits.join(""), 10)
    };
  }
`
  };
});
