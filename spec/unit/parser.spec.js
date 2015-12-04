define(['../../js/parser.js'], function (parser) {
  'use strict';

  describe('Parser', function () {
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
      testFile.forEach(function (testFile) {
        expect(parser.parse(testFile.filename)).toBe(testFile.expectedOutcome);
      });
    });
  });

});
