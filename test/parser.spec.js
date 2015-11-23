define(['../js/parser.js'], function (parser) {
  'use strict';

  console.log("toto")

  var retrieveTestFiles = function() {
    return [
      { filename: 'ko.logo',              expected_outcome: 1 },
      { filename: 'ko2.logo',             expected_outcome: 1 },
      { filename: 'ok-comment.logo',      expected_outcome: 0 },
      { filename: 'ok-simple.logo',       expected_outcome: 0 },
      { filename: 'ok-simple2.logo',      expected_outcome: 0 },
      { filename: 'ok-ultra-simple.logo', expected_outcome: 0 }
    ]
  }

  //var parser = require('../js/parser.js');

  describe('Parser test', function () {
    // Retrieve the file and filter only the ones that are parsable
    var test_files = retrieveTestFiles().filter(function (entry) {
      return entry.expected_outcome == 0;
    });

    it("shall be able to parse acceptable logo program", function () { 
      test_files.forEach(function (test_file) {
        expect(parser.parse(test_file)).toBe(0);
      });
    });
  });
});