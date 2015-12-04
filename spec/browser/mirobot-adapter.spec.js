define(['../../js/mirobot-adapter.js'], function (mirobotAdapterFactory) {
  'use strict';

  var mockMirobotService = {
    send: jasmine.createSpy('send')
  };
  var mirobotAdapter;

  beforeEach(function () {
     mirobotAdapter = mirobotAdapterFactory.createAdapter(mockMirobotService);
  });

  describe('Mirebot Adapter', function () {
    it('on call to avance shall call send on the mirobotService with a avance command', function() {
      mirobotAdapter.avance(10);
      expect(mockMirobotService.send).toHaveBeenCalledWith({ cmd: 'forward', distance: 10 });
    });
    it('on call to recule shall call send on the mirobotService with a recule command', function() {
      mirobotAdapter.recule(11);
      expect(mockMirobotService.send).toHaveBeenCalledWith({ cmd: 'back', distance: 11 });
    });
    it('on call to tournedroite shall call send on the mirobotService with a tournedroite command', function() {
      mirobotAdapter.tournedroite(45);
      expect(mockMirobotService.send).toHaveBeenCalledWith({ cmd: 'right', distance: 45 });
    });
    it('on call to tournegauche shall call send on the mirobotService with a tournegauche command', function() {
      mirobotAdapter.tournegauche(90);
      expect(mockMirobotService.send).toHaveBeenCalledWith({ cmd: 'left', distance: 90 });
    });
    it('on call to levecrayon shall call send on the mirobotService with a levecrayon command', function() {
      mirobotAdapter.levecrayon();
      expect(mockMirobotService.send).toHaveBeenCalledWith({ cmd: 'penup' });
    });
    it('on call to baissecrayon shall call send on the mirobotService with a baissecrayon command', function() {
      mirobotAdapter.baissecrayon();
      expect(mockMirobotService.send).toHaveBeenCalledWith({ cmd: 'pendown' });
    });
  });
});
