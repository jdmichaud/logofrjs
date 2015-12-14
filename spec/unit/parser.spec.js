require(['fs', 'pegjs', 'parser'], function (fs, PEG, parser) {
  'use strict';

  describe('Parser', function () {
    var testFile = [
      { filename: 'logo/ko-instr-no-newline.logo',   expectedOutcome: 1 },
      { filename: 'logo/ko-missing-argument.logo',   expectedOutcome: 0 }, // Catched by the syntax checker
      { filename: 'logo/ko-negative-argument.logo',  expectedOutcome: 1 },
      { filename: 'logo/ko-repeat-no-arg.logo',      expectedOutcome: 1 },
      { filename: 'logo/ko-two-arguments.logo',      expectedOutcome: 1 },
      { filename: 'logo/ko.logo',                    expectedOutcome: 0 }, // Catched by the syntax checker
      { filename: 'logo/ko2.logo',                   expectedOutcome: 0 }, // Catched by the syntax checker
      { filename: 'logo/ok-bracket-instr.logo',      expectedOutcome: 0 },
      { filename: 'logo/ok-calibrate.logo',          expectedOutcome: 0 },
      { filename: 'logo/ok-comment.logo',            expectedOutcome: 0 },
      { filename: 'logo/ok-instr-no-newline.logo',   expectedOutcome: 0 },
      { filename: 'logo/ok-maison.logo',             expectedOutcome: 0 },
      { filename: 'logo/ok-repeat.logo',             expectedOutcome: 0 },
      { filename: 'logo/ok-simple.logo',             expectedOutcome: 0 },
      { filename: 'logo/ok-simple2.logo',            expectedOutcome: 0 },
      { filename: 'logo/ok-square.logo',             expectedOutcome: 0 },
      { filename: 'logo/ok-ultra-simple.logo',       expectedOutcome: 0 }
    ];

    testFile.forEach(function (testFile) {
      it('shall accept only properly formed logo program (' + testFile.filename + ')', function () {
        var content = fs.readFileSync(testFile.filename, 'utf8').toString();
        var grammar = fs.readFileSync('grammar/logo.peg', 'utf8').toString();
        expect(parser.parse(PEG, PEG.visitor, content, grammar, false).errno).toBe(testFile.expectedOutcome);
      });
    });
  });
});
