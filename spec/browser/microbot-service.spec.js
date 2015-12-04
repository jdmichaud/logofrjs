define(['../../js/mirobot-service.js'], function (mirobotService) {
  'use strict';

  // connect
  // send
  // on connection close
  // double send
  // Add spy on WebSocket constructor

  describe('Mirobot Service test', function () {
    var webSocketConstructorSpy;
    var ip = '192.168.1.1';
    var port = 123;
    var mockWebSocket = {
      addr: '',
      send: function(msg) {},
      callCBs: function() {
        // Call the callback provided
        this.onopen();
        this.onclose();
        this.onerror();
      },
      // Generate a message from the WebSocket server with the provided
      // callback id
      sendResponse: function(id) {
        this.onmessage({ data: JSON.stringify({ id: id }) });
      }
    };
    var mockCallBack = {
      onopen: function() {},
      onclose: function() {},
      onerror: function() {},
    };
    var onOpenSpy;
    var onCloseSpy;
    var onErrorSpy;
    var onWebSocketSendSpy;

    beforeEach(function() {
      // Create a spy on the WebSocket objsct constructor
      webSocketConstructorSpy = spyOn(window, 'WebSocket').and.callFake(function(addr) {
        mockWebSocket.addr = addr;
        return mockWebSocket;
      });
      // Add WebSocket send spy
      onWebSocketSendSpy = spyOn(mockWebSocket, 'send');
      // Add spy to callbacks
      onOpenSpy = spyOn(mockCallBack, 'onopen');
      onCloseSpy = spyOn(mockCallBack, 'onclose');
      onErrorSpy = spyOn(mockCallBack, 'onerror');
    });

    it('on call to connect, mirobotService shall connect to a web socket server specified by a address and a port', function () {
      // Connect to the WebSocket mock server
      mirobotService.connect(ip, port, mockCallBack.onopen,
                             mockCallBack.onclose, mockCallBack.onerror);
      // Check the WebSocket constructor was properly called
      expect(webSocketConstructorSpy).toHaveBeenCalledWith('ws://' + ip + ':' + port + '/');
    });

    it('on call to connect, mirobotService shall hook the provided callbacks to the WebSocket object', function () {
      // Connect to the WebSocket mock server
      mirobotService.connect(ip, port, mockCallBack.onopen,
                             mockCallBack.onclose, mockCallBack.onerror);
      // Simulate a call to service callbacks
      mockWebSocket.callCBs();
      // Ckeck the callbacks have been called
      expect(onOpenSpy).toHaveBeenCalled();
      expect(onCloseSpy).toHaveBeenCalled();
      expect(onErrorSpy).toHaveBeenCalled();
    });

    it('on call to send, mirobotService shall send a message to the WebSocket server', function () {
      // Connect to the WebSocket mock server
      mirobotService.connect(ip, port, mockCallBack.onopen,
                             mockCallBack.onclose, mockCallBack.onerror);
      // Call send on the service
      mirobotService.send({ toto: 'titi' });
      // Check send has been called to the WebSocket object
      expect(onWebSocketSendSpy).toHaveBeenCalled();
      // Check the argument
      expect(JSON.parse(mockWebSocket.send.calls.allArgs()[0])).toEqual({ id: 1, toto: 'titi' });
    });

    it('on successive call to send, mirobotService shall forward the request to the WebSocket server only when the onmessage of the previous request has been received from the server', function () {
      // Connect to the WebSocket mock server
      mirobotService.connect(ip, port, mockCallBack.onopen,
                             mockCallBack.onclose, mockCallBack.onerror);
      // Call send on the service
      mirobotService.send({ toto: 'titi' });
      // Check send has been called to the WebSocket object
      expect(onWebSocketSendSpy).toHaveBeenCalled();
      // Check the argument
      expect(JSON.parse(mockWebSocket.send.calls.allArgs()[0])).toEqual({ id: 1, toto: 'titi' });
      // Call send a second time before the call back from the WebSocket server
      mirobotService.send({ toto: 'tutu' });
      // Check send has NOT been called to the WebSocket object
      expect(mockWebSocket.send.calls.count()).toEqual(1);
      // Simulate the callback from the WebSocket server
      mockWebSocket.sendResponse(1);
      // Check send has been called twice now
      expect(mockWebSocket.send.calls.count()).toEqual(2);
      // Check the argument of the second call
      expect(JSON.parse(mockWebSocket.send.calls.allArgs()[1])).toEqual({ id: 2, toto: 'tutu' });
    });
  });
});