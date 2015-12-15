define(['../../app/js/parser.js'], function (parser) {
  'use strict';

  // ****** Syntax Checker tests ****** //

  describe('Syntax checker', function () {
    it('shall return 2 if an instruction is unknown', function () {
      expect(parser.syntaxCheck(PEG.visitor, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'AVINCE', arg: '12', line: 12 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 2
      }));
    });

    it('shall return 3 if an argument is missing', function () {
      expect(parser.syntaxCheck(PEG.visitor, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'TD', line: 12 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 3
      }));
    });

    it('shall return 4 if an argument is missing', function () {
      expect(parser.syntaxCheck(PEG.visitor, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'BC', arg: '10', line: 12 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 4
      }));
    });

    it('shall return 0 on properly formed abstract syntax tree', function () {
      expect(parser.syntaxCheck(PEG.visitor, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'BC', line: 1 },
          { type: 'INSTRUCTION', command: 'AVANCE', arg: 10, line: 2 },
          { type: 'INSTRUCTION', command: 'TD', arg: 90, line: 3 },
          { type: 'INSTRUCTION', command: 'av', arg: 10, line: 4 },
          { type: 'INSTRUCTION', command: 'levecrayon', line: 5 },
          { type: 'REPEAT', line: 6, instructions: [
            { type: 'LIST', line: 6, instructions: [
              { type: 'INSTRUCTION', command: 'AVANCE', arg: 10, line: 7 },
              { type: 'INSTRUCTION', command: 'TD', arg: 90, line: 8 }
            ] }
          ] },
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 0
      }));
    });
  });

  // ****** Normalizer tests ****** //
  describe('Normalizer', function () {
    it('shall return the AST with all the command name expanded and in upper case', function() {
      expect(parser.normalize(PEG.visitor, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'BC', line: 1 },
          { type: 'INSTRUCTION', command: 'AVANCE', arg: 10, line: 2 },
          { type: 'INSTRUCTION', command: 'TD', arg: 90, line: 3 },
          { type: 'INSTRUCTION', command: 'av', arg: 10, line: 4 },
          { type: 'INSTRUCTION', command: 'levecrayon', line: 5 }
        ]
      })).toEqual({
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'BAISSECRAYON', line: 1 },
          { type: 'INSTRUCTION', command: 'AVANCE', arg: 10, line: 2 },
          { type: 'INSTRUCTION', command: 'TOURNEDROITE', arg: 90, line: 3 },
          { type: 'INSTRUCTION', command: 'AVANCE', arg: 10, line: 4 },
          { type: 'INSTRUCTION', command: 'LEVECRAYON', line: 5 }
        ]
      });
    });

  });
});