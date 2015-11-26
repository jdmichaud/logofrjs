// Jean-Daniel Michaud - 2015
//
// This service offers API for mirobot communication back and forth

define(function () {
  'use strict';
  // We return this object to anything injecting our service
  var Service = {};
  // Keep all pending requests here until they get responses
  var callbacks = {};
  // Create a unique callback ID to map requests to responses
  var currentCallbackId = 0;
  // Hold our WebSocket object. Will be initialized on call to connect.
  var _ws;
  // Create a default defer notified when a message is not a answer to a request
  var defaultDefer = $q.defer();

  _ws.onopen = function(){
      console.log('Socket has been opened!');
  };

  _ws.onmessage = function(message) {
    listener(JSON.parse(message.data));
  };

  // Prepare a callback object associated to the request containing a callbackId
  // and a promise object.
  function sendRequest(request) {
    var defer = $q.defer();
    var callbackId = getCallbackId();
    callbacks[callbackId] = {
      time: new Date(),
      cb:defer
    };
    //request.callback_id = callbackId;
    console.log('Sending request', request);
    ws.send(JSON.stringify(request));
    return defer.promise;
  }

  function listener(data) {
    var messageObj = data;
    //console.log("Received data from websocket: ", messageObj);
    // If an object exists with callback_id in our callbacks object, resolve it
    if(callbacks.hasOwnProperty(messageObj.callback_id)) {
      console.log(callbacks[messageObj.callback_id]);
      $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj));
      delete callbacks[messageObj.callbackID];
    } else {
      defaultDefer.notify(messageObj);
    }
  }
  // This creates a new callback ID for a request
  function getCallbackId() {
    currentCallbackId += 1;
    if(currentCallbackId > 10000) {
      currentCallbackId = 0;
    }
    return currentCallbackId;
  }

  // Get the promise for uncalled for events
  Service.messageHandler = function () {
    return defaultDefer.promise;
  }

  // Push a regular button
  Service.pushButton = function(button) {
    var request = { command: "pushButton", args: { buttonName: button } };
    // Storing in a variable for clarity on what sendRequest returns
    var promise = sendRequest(request);
    return promise;
  }

  // Connect to the mirobot
  Service.connect = function(ip, port, suffix) {
    if (suffix === undefined) { suffix = ''; }
    _ws = new WebSocket('ws://' + ws + ':' + port + '/' + suffix);
  }

  return Service;

});
