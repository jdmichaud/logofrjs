// Jean-Daniel Michaud - 2015
//
// The mirobot adapter translates function call to send order to the mirobot
// service

define(function () {
  'use strict';

  // The websocket service to use to emit commands
  var _mirobotService;

  var webSocketAdapter = {
    avance: function (arg) {
      _mirobotService.send({ cmd: 'forward', distance: arg });
    },
    recule: function (arg) {
      _mirobotService.send({ cmd: 'back', distance: arg });
    },
    tournedroite: function (arg) {
      _mirobotService.send({ cmd: 'right', distance: arg });
    },
    tournegauche: function (arg) {
      _mirobotService.send({ cmd: 'left', distance: arg });
    },
    levecrayon: function () {
      _mirobotService.send({ cmd: 'penup' });
    },
    baissecrayon: function () {
      _mirobotService.send({ cmd: 'pendown' });
    }
  };

  return {
    createAdapter: function (mirobotService) {
      _mirobotService = mirobotService;
      return webSocketAdapter;
    }
  };

});
