// Jean-Daniel Michaud - 2015
//
// This module contains the PEG.js grammar of the french version of LOGO

define(function() {

  return {
    grammar:
`
program =
  i:( instruction ) * {
    return {
      type: "PROGRAM",
      instrutions: i
    };
  }

keyword =
  "AVANCE" / "AC" / "RECULE" / "RE" 
  / "TOURNEDROITE" / "TD" / "TOURNEGAUCHE" / "TG"
  / "LEVECRAYON" / "LC" / "BAISSECRAYON" / "BC"

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

noarg_instruction =
  k:keyword _ digits:integer _ newline? {
    return {
      type: "INSTRUCTION",
      command: k,
      arg: parseInt(digits.join(""), 10)
    };
  }

arg_instruction =
  k:keyword _ newline? {
    return {
      type: "INSTRUCTION",
      command: k,
    };
  }

null_instruction = 
  comment _? newline? {
    return {};
  }
  / _? newline {
    return {};
  }

// Define what is an instruction
instruction =
  noarg_instruction
  / arg_instruction
  / null_instruction
`
  };
});
