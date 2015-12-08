define(['../../app/js/interpreter.js'], function (interpreter) {
  'use strict';

  var mockMirobotService = {
    avance:       jasmine.createSpy('avance'),
    recule:       jasmine.createSpy('recule'),
    tournedroite: jasmine.createSpy('tournedroite'),
    tournegauche: jasmine.createSpy('tournegauche'),
    levecrayon:   jasmine.createSpy('levecrayon'),
    baissecrayon: jasmine.createSpy('baissecrayon')
  };

  describe('Interpreter', function () {
    it('shall call avance on the provided adapter if the AST has an AVANCE instruction', function () {
      interpreter.interpret(PEG.visitor, mockMirobotService, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'AVANCE', arg: '10', line: 1 }
        ]
      });
      expect(mockMirobotService.avance).toHaveBeenCalledWith('10');
    });
    it('shall call recule on the provided adapter if the AST has an RECULE instruction', function () {
      interpreter.interpret(PEG.visitor, mockMirobotService, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'RECULE', arg: '11', line: 1 }
        ]
      });
      expect(mockMirobotService.recule).toHaveBeenCalledWith('11');
    });
    it('shall call tournedroite on the provided adapter if the AST has an TOURNEDROITE instruction', function () {
      interpreter.interpret(PEG.visitor, mockMirobotService, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'TOURNEDROITE', arg: '12', line: 1 }
        ]
      });
      expect(mockMirobotService.tournedroite).toHaveBeenCalledWith('12');
    });
    it('shall call tournegauche on the provided adapter if the AST has an TOURNEGAUCHE instruction', function () {
      interpreter.interpret(PEG.visitor, mockMirobotService, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'TOURNEGAUCHE', arg: '13', line: 1 }
        ]
      });
      expect(mockMirobotService.tournegauche).toHaveBeenCalledWith('13');
    });
    it('shall call levecrayon on the provided adapter if the AST has an LEVECRAYON instruction', function () {
      interpreter.interpret(PEG.visitor, mockMirobotService, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'LEVECRAYON', line: 1 }
        ]
      });
      expect(mockMirobotService.levecrayon).toHaveBeenCalled();
    });
    it('shall call baissecrayon on the provided adapter if the AST has an BAISSECRAYON instruction', function () {
      interpreter.interpret(PEG.visitor, mockMirobotService, {
        type: 'PROGRAM',
        instructions: [
          { type: 'INSTRUCTION', command: 'BAISSECRAYON', line: 1 }
        ]
      });
      expect(mockMirobotService.baissecrayon).toHaveBeenCalled();
    });
  });
});
