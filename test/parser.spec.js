define(['../js/parser.js'], function (parser) {
  'use strict';

  var retrieveTestFiles = function() {
    return [
      { filename: 'ko.logo',                    expectedOutcome: 1 },
      { filename: 'ko2.logo',                   expectedOutcome: 1 },
      { filename: 'ko-negative-argument.logo',  expectedOutcome: 1 },
      { filename: 'ko-two-arguments.logo',      expectedOutcome: 1 },
      { filename: 'ok-comment.logo',            expectedOutcome: 0 },
      { filename: 'ok-simple.logo',             expectedOutcome: 0 },
      { filename: 'ok-simple2.logo',            expectedOutcome: 0 },
      { filename: 'ok-ultra-simple.logo',       expectedOutcome: 0 }
    ];
  };

  describe('Parser test', function () {
    it('shall accept only properly formed logo program', function () {
      retrieveTestFiles().forEach(function (testFile) {
        expect(parser.parse(testFile.filename)).toBe(testFile.expectedOutcome);
      });
    });
  });
});