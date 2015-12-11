// Jean-Daniel Michaud - 2015
//
// Main entry point for logofrjs in the Browser

require(['mirobot-service', 'controllers/turtle-ctrl',
         'services/interpreter-service', 'services/file-retrieval-service'],
        function(mirobotService, TurtleCtrl, interpreterService, fileRetrievalService) {
  'use strict';

  // Create the angular module
  var turtleApp = angular.module('turtleApp', []);

  // Register the mirobot service for websocket communication in the angular
  // controller
  turtleApp.factory('MirobotService', function () {
    return mirobotService;
  });

  // Register the interpreter service
  turtleApp.factory('InterpreterService', ['MirobotService', function (mirobotService) {
    return interpreterService(mirobotService);
  }]);

  // Register the file retrieval service. There must be a better way for this...
  turtleApp.factory('FileRetrievalService', function () {
    return fileRetrievalService();
  });

  angular.module('turtleApp').controller(
    'TurtleCtrl',
    ['$scope', 'MirobotService', 'InterpreterService', 'FileRetrievalService', TurtleCtrl]
  );

  // Because angular is loaded in the require function, we cannot plug the
  // application in the view through the ng-app directive. So we initialize
  // angular here using the bootstrap method.
  angular.bootstrap(document, ['turtleApp']);
});
