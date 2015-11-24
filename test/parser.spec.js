define(['../js/parser.js'], function (parser) {
  'use strict';

  var retrieveTestFiles = function() {
    return [
      { filename: 'ko.logo',                    expected_outcome: 1 },
      { filename: 'ko2.logo',                   expected_outcome: 1 },
      { filename: 'ko-negative-argument.logo',  expected_outcome: 1 },
      { filename: 'ko-two-arguments.logo',      expected_outcome: 1 },
      { filename: 'ok-comment.logo',            expected_outcome: 0 },
      { filename: 'ok-simple.logo',             expected_outcome: 0 },
      { filename: 'ok-simple2.logo',            expected_outcome: 0 },
      { filename: 'ok-ultra-simple.logo',       expected_outcome: 0 }
    ]
  }

  describe('Parser test', function () {
    it("shall accept only properly formed logo program", function () {
      retrieveTestFiles().forEach(function (test_file) {
        expect(parser.parse(test_file.filename)).toBe(test_file.expected_outcome);
      });
    });
  });
});