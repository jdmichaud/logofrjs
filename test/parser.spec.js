define(['../js/parser.js'], function (parser) {
  'use strict';

  describe('Parser test', function () {
    it('shall accept only properly formed logo program', function () {
      var testFile = [
        { filename: 'ko.logo',                    expectedOutcome: 1 },
        { filename: 'ko2.logo',                   expectedOutcome: 1 },
        { filename: 'ko-negative-argument.logo',  expectedOutcome: 1 },
        { filename: 'ko-two-arguments.logo',      expectedOutcome: 1 },
        { filename: 'ok-comment.logo',            expectedOutcome: 0 },
        { filename: 'ok-simple.logo',             expectedOutcome: 0 },
        { filename: 'ok-simple2.logo',            expectedOutcome: 0 },
        { filename: 'ok-ultra-simple.logo',       expectedOutcome: 0 }
      ];
      testFile().forEach(function (testFile) {
        expect(parser.parse(testFile.filename)).toBe(testFile.expectedOutcome);
      });
    });
  });

  describe('Syntax checker test', function () {
    it('shall return 2 if an instruction is unknown', function () {
      expect(parser.syntaxCheck({
        type: 'PROGRAM',
        instructions: [
          { command: 'AVINCE', arg: '12', line: 12 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 2
      }));
    });

    it('shall return 3 if an argument is missing', function () {
      expect(parser.syntaxCheck({
        type: 'PROGRAM',
        instructions: [
          { command: 'TD', line: 12 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 3
      }));
    });

    it('shall return 4 if an argument is missing', function () {
      expect(parser.syntaxCheck({
        type: 'PROGRAM',
        instructions: [
          { command: 'BC', arg: '10', line: 12 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 4
      }));
    });

    it('shall return 0 on properly formed abstract syntax tree', function () {
      expect(parser.syntaxCheck({
        type: 'PROGRAM',
        instructions: [
          { command: 'BC', line: 1 },
          { command: 'AVANCE', arg: 10, line: 2 },
          { command: 'TD', arg: 90, line: 3 },
          { command: 'AV', arg: 10, line: 4 },
          { command: 'LEVECRAYON', line: 5 }
        ]
      })).toEqual(jasmine.objectContaining({
        errno: 0
      }));
    });
  });
});