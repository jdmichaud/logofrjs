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
  var _callbacks = {};
  // Create a unique callback ID to map requests to responses
  var currentCallbackId = 0;
  // Hold our WebSocket object. Will be initialized on call to connect.
  var _ws;
  // State of the mirobot. The mirobot server does not have a message queue so
  // we can't send more than 1 request at once. So we need to keep track of the
  // mirobot state.
  // false: idle
  // true: busy
  var _mirobotState = false;
  // Message queue to buffer messages to be sent to the mirobot
  var _msgQueue = [];
  // Position this flag to close the websocket connection upon last message
  // answered
  var _closeRequestPending = false;

  // Upon reception of a message through the WebSocker interface, parse the json
  // and call the listener
  function _onmessage(message) {
    //console.log(message);
    listener(JSON.parse(message.data));
  }

  // Get the data on message reception and notify the appropriate Promise
  function listener(message) {
    console.log('--> ', message);
    // Mirobot just answered, to is not busy anymore
    _mirobotState = false;
    // If an object exists with callback_id in our _callbacks object, resolve it
    if (_callbacks.hasOwnProperty(message.id.toString())) {
      if (message.status === 'complete') {
        var callback = _callbacks[message.id.toString()];
        delete _callbacks[message.id.toString()];
        // Process the next message as soon as possible
        processMessage();
        // Call back the client code
        callback.resolve();
      } else {
        // Just ignore accepted status
      }
    } else {
      // Else call the default callback
      Service.messageHandler(message);
    }
    // If no more message to be processed and close requested
    if (_msgQueue.length === 0 && _closeRequestPending) {
      forceClose();
    }
  }

  // Prepare a callback object associated to the request containing a callbackId
  // and a promise object.
  function sendRequest(request) {
    //console.log('Sending request', request);
    if (_ws.readyState === _ws.OPEN) {
      _mirobotState = true;
      console.log('<-- ', request);
      _ws.send(JSON.stringify(request));
    } else {
      var callback = _callbacks[request.id.toString()];
      delete _callbacks[request.id.toString()];
      // Signal the client code that the promise has failed
      callback.reject({ errno: eErrCode.CONN_CLOSED,
                        err: 'Websocket connection is closed' });
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

  // Check the mirobot status and send the next message is available
  function processMessage() {
    // If there are messages to be sent and mirobot is ready to receive
    if (_msgQueue.length > 0 && _mirobotState === false) {
      // send the older message
      sendRequest(_msgQueue.shift());
    }
  }

  function forceClose () {
    _ws.terminate();
  }

  function reinit () {
    // Clear the mirobot state
    _mirobotState = false;
    // Clear the message queue
    _msgQueue = [];
    // Clear the callback map
    _callbacks = {};
    currentCallbackId = 0;
  }

  // Default message handler for message without registered callback
  Service.messageHandler = function (messageObj) {
    console.log('WARNING! message received without a valid callback ID: ',
                messageObj);
    console.log('Pensing request:');
    console.log(_callbacks);
  };

  // Send a request to mirobot
  Service.send = function(request) {
    // Storing in a variable for clarity on what sendRequest returns
    var promise = new Promise(function (resolve, error) {
      var callbackId = getCallbackId();
      _callbacks[callbackId] = {
        time: new Date(),
        resolve: resolve,
        reject: error
      };
      request.id = callbackId;
    });
    // Push the message on the queue
    _msgQueue.push(request);
    // Process the message is the mirobot is idle
    processMessage();
    // Return the promise to the client code
    return promise;
  };

  // Connect to the mirobot
  Service.connect = function(ip, port, onopen, onclose, onerror, suffix) {
    if (suffix === undefined) { suffix = ''; }
    // Reinit the module state
    reinit();
    // Connect to the server
    _ws = new WebSocket('ws://' + ip + ':' + port + '/' + suffix);
    // Initialize the callback handlers
    _ws.onopen = onopen;
    _ws.onclose = onclose;
    _ws.onerror = onerror;
    _ws.onmessage = _onmessage;
  };

  Service.close = function (waitForServer) {
    if (waitForServer) { // Wait for all the command to be processed
      _closeRequestPending = true;
    }
    else {
      forceClose();
    }
  };

  return Service;

});
