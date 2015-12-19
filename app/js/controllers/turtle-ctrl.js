
define(function () {
  'use strict';

  // Main controlle1r
  var TurtleCtrl = function TurtleCtrl($scope, mirobotService, interpreter, fileRetrievalService) {
    var grammar = '';

    var reinitError = function () {
      $scope.errno = 0;
      $scope.err = '';
    };

    var reinitMessageTortue = function () {
      console.log('reinitMessageTortue running:', $scope.running);
      if ($scope.connected && !$scope.running) {
        $scope.messageTortue = 'J\'ecoute';
      } else if ($scope.running) {
        $scope.messageTortue = 'Je travaille';
      } else {
        $scope.messageTortue = 'zzZZzzz..oOo..o....';
      }
    };

    // Initialize the scope
    $scope.mirobotip = '';
    $scope.content = '';
    $scope.connected = false;
    $scope.running = false;
    reinitError();
    reinitMessageTortue();
    // Retrieve the grammar on the server
    fileRetrievalService.retrieve('/logo.peg').then(function (grammarLoaded) {
      grammar = grammarLoaded;
    });

    // Called when all the message sent are processed
    $scope.finishedProcessing = function () {
      console.log('finished processing');
      $scope.$apply(function() {
        $scope.running = false;
        reinitMessageTortue();
      });
    };

    // Connect the mirobot
    $scope.connect = function () {
      console.log('connect called');
      mirobotService.connect($scope.mirobotip, 8899, function () {
        // on open
        console.log('Mirobot connection open');
        $scope.$apply(function() {
          $scope.connected = true;
          reinitError();
          reinitMessageTortue();
        });
      }, function () {
        // on close
        console.log('Mirobot connection closed');
        $scope.$apply(function() {
          $scope.connected = false;
          reinitError();
          reinitMessageTortue();
        });
      }, function () {
        // on error
        console.log('Mirobot connection error');
        $scope.$apply(function() {
          $scope.connected = false;
          reinitError();
          reinitMessageTortue();
        });
      }, 'websocket', $scope.finishedProcessing);
    };

    // Execute the program
    $scope.execute = function () {
      reinitError();
      $scope.running = true;
      reinitMessageTortue();
      var ret = interpreter.interpret($scope.content, grammar);
      if (ret.errno !== 0) {
        $scope.messageTortue = 'Oops !...';
        $scope.errno = ret.errno;
        $scope.err = ret.err;
      } else {
        reinitMessageTortue();
      }
    };

    // Execute the program
    $scope.interrupt = function () {
      mirobotService.interrupt();
      $scope.running = false;
      reinitMessageTortue();
    };
  };

  return TurtleCtrl;

});
