
define(function () {
  'use strict';

  // Main controlle1r
  var TurtleCtrl = function TutrleCtrl($scope, mirobotService, interpreter, fileRetrievalService) {
    var grammar = '';

    var reinitError = function () {
      $scope.errno = 0;
      $scope.err = '';
    };

    var reinitMessageTortue = function () {
      if ($scope.connected) {
        $scope.messageTortue = 'J\'ecoute';
      } else {
        $scope.messageTortue = 'zzZZzzz..oOo..o....';
      }
    };

    // Initialize the scope
    $scope.mirobotip = '';
    $scope.content = '';
    $scope.connected = false;
    reinitError();
    reinitMessageTortue();
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
        $scope.$apply(function() {
          reinitError();
          reinitMessageTortue();
          $scope.connected = true;
        });
      }, function () {
        // on close
        console.log('Mirobot connection closed');
        $scope.$apply(function() {
          reinitError();
          reinitMessageTortue();
          $scope.connected = false;
        });
      }, function () {
        // on error
        console.log('Mirobot connection error');
        $scope.$apply(function() {
          reinitError();
          reinitMessageTortue();
          $scope.connected = false;
        });
      });
    };

    // Execute the program
    $scope.execute = function () {
      reinitError();
      $scope.messageTortue = 'Je travaille';
      var ret = interpreter.interpret($scope.content, grammar);
      if (ret.errno !== 0) {
        $scope.messageTortue = 'Oops !...';
        $scope.errno = ret.errno;
        $scope.err = ret.err;
      } else {
        reinitMessageTortue();
      }
    };
  };

  return TurtleCtrl;

});
