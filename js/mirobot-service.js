// Jean-Daniel Michaud - 2015
//
// This service offers API for mirobot communication back and forth

define(function () {
  'use strict';
  // First, the error codes
  var eErrCode = {
    CONN_CLOSED: 1
  };
  // We return this object to anything injecting our service
  var Service = {};
  // Keep all pending requests here until they get responses
  var callbacks = {};
  // Create a unique callback ID to map requests to responses
  var currentCallbackId = 0;
  // Hold our WebSocket object. Will be initialized on call to connect.
  var _ws;

  // Upon reception of a message through the WebSocker interface, parse the json
  // and call the listener
  function _onmessage(message) {
    listener(JSON.parse(message.data));
  }

  // Get the data on message reception and notify the appropriate Promise
  function listener(data) {
    var messageObj = data;
    // If an object exists with callback_id in our callbacks object, resolve it
    if (callbacks.hasOwnProperty(messageObj.id)) {
      var callback = callbacks[messageObj.id];
      delete callbacks[messageObj.id];
      callback.resolve(messageObj);
    } else {
      // Else call the default callback
      Service.messageHandler(messageObj);
    }
  }

  // Prepare a callback object associated to the request containing a callbackId
  // and a promise object.
  function sendRequest(request) {
    return new Promise(function (resolve, reject) {
      var callbackId = getCallbackId();
      callbacks[callbackId] = {
        time: new Date(),
        resolve: resolve,
        reject: reject
      };
      request.id = callbackId;
      console.log('Sending request', request);
      if (_ws.readyState === _ws.OPEN) {
        _ws.send(JSON.stringify(request));
      } else {
        reject({ errno: eErrCode.CONN_CLOSED,
                 err: 'Websocket connection is closed' });
      }
    });
  }

  // This creates a new callback ID for a request
  function getCallbackId() {
    currentCallbackId += 1;
    if(currentCallbackId > 10000) {
      currentCallbackId = 0;
    }
    return currentCallbackId;
  }

  // Default message handler for message without registered callback
  Service.messageHandler = function (messageObj) {
    console.log('WARNING! message received without a valid callback ID: ',
                messageObj);
  };

  // Push a regular button
  Service.send = function(msg) {
    var request = msg;
    // Storing in a variable for clarity on what sendRequest returns
    var promise = sendRequest(request);
    return promise;
  };

  // Connect to the mirobot
  Service.connect = function(ip, port, onopen, onclose, onerror, suffix) {
    if (suffix === undefined) { suffix = ''; }
    // Clear the callback queue
    callbacks = {};
    currentCallbackId = 0;
    // Connect to the server
    _ws = new WebSocket('ws://' + ip + ':' + port + '/' + suffix);
    // Initialize the callback handlers
    _ws.onopen = onopen;
    _ws.onopen = onclose;
    _ws.onerror = onerror;
    _ws.onmessage = _onmessage;
  };

  return Service;

});
