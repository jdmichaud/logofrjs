// Jean-Daniel Michaud - 2015
//
// Main entry point for logofrjs in the Browser

require(['./mirobot-service', 'mirobot-adapter', 'interpreter', './parser'],
        function(mirobotService, adapterFactory, interpreter, parser) {
  'use strict';

  // Create the angular module
  var turtleApp = angular.module('turtleApp', []);

  // Register the mirobot service for websocket communication in the angular
  // controller
  turtleApp.factory('MirobotService', function () {
    return mirobotService;
  });

  // Register the interpreter service
  turtleApp.factory('InterpreterService', function () {
    // Create an adapter plugged to the websocket service
    var adapter = adapterFactory.createAdapter(mirobotService);
    return {
      interpret: function (content, logoGrammar) {
        // Parse the loaded file
        var parseRet = parser.parse(PEG, PEG.visitor, content, logoGrammar, false);
        if (parseRet.err) {
          // Error while walking the AST
          console.log(parseRet.err);
          return parseRet;
        } else {
          // Check the syntax of the parsed AST
          var syntaxCheckRet = parser.syntaxCheck(PEG.visitor, parseRet.ast);
          if (syntaxCheckRet.errno !== 0) {
            console.log('Error(' , syntaxCheckRet.errno, '): ',
                        syntaxCheckRet.err);
            return syntaxCheckRet;
          }
          // Normalize the AST
          parseRet.ast = parser.normalize(PEG.visitor, parseRet.ast);
          // Interpret the AST and issue mirobot command
          interpreter.interpret(PEG.visitor, adapter, parseRet.ast);
          return { errno: 0, err: '' };
        }
      }
    };
  });

  // Register the file retrieval service. There must be a better way for this...
  turtleApp.factory('FileRetrievalService', function () {
    var httpGetAsync = function (url, callback, waitcb, errorcb) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          callback(xmlHttp.responseText);
        } else if (xmlHttp.status === 200 || xmlHttp.status === 0) { // No particular error, just busy...
          waitcb();
        } else {
          errorcb(xmlHttp.status);
        }
      };
      xmlHttp.open('GET', url, true); // true for asynchronous
      xmlHttp.send(null);
    };

    return {
      retrieve: function (url) {
        var promise = new Promise(function(resolve, reject) {
//          httpGetAsync('/logo.peg', function (logoGrammar) {
          httpGetAsync(url, function (fileContent) {
            console.log('Ready to parse');
            resolve(fileContent);
          }, function () {
            console.log('Grammar loading...');
          }, function (httpStatus) {
            console.log('Could not load the logo grammar file, status: ',
                        httpStatus);
            reject(httpStatus);
          });
        });
        return promise;
      }
    };
  });

  // Main controlle1r
  turtleApp.controller('TurtleCtrl', ['$scope', 'MirobotService',
                                      'InterpreterService', 'FileRetrievalService',
                                      function ($scope, mirobotService,
                                                interpreter, fileRetrievalService) {
    var grammar = '';
    // Initialize the scope
    $scope.mirobotip = '';
    $scope.content = '';
    $scope.bougeDisabled = true;
    $scope.appelerDisabled = false;
    $scope.messageTortue = 'zzZZzzz..oOo..o....';
    // Retrieve the grammar on the server
    fileRetrievalService.retrieve('/logo.peg').then(function (grammarLoaded) {
      grammar = grammarLoaded;
    });

    // Connect the mirobot
    $scope.connect = function () {
      console.log('connect called');
      mirobotService.connect($scope.mirobotip, 8899, function () {
        // on open
        console.log('Mirobot connection open');
        $scope.bougeDisabled = false;
        $scope.appelerDisabled = true;
        $scope.messageTortue = 'J\'ecoute !';
      }, function () {
        // on close
        console.log('Mirobot connection closed');
        $scope.bougeDisabled = false;
        $scope.appelerDisabled = true;
        $scope.messageTortue = 'zzZZzzz..oOo..o....';
      }, function () {
        // on error
        console.log('Mirobot connection error');
        $scope.bougeDisabled = false;
        $scope.appelerDisabled = true;
        $scope.messageTortue = 'zzZZzzz..oOo..o....';
      });
    };

  }]);

  // Because angular is loaded in the require function, we cannot plug the
  // application in the view through the ng-app directive. So we initialize
  // angular here using the bootstrap method.
  angular.bootstrap(document, ['turtleApp']);
});
