'use strict';

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8899 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('--> %s', message);
    message = JSON.parse(message);
    // Send the callback
    var data = JSON.stringify({ id: message.id, status: 'complete' });
    console.log('<--', data);
    ws.send(data);
  });
});
