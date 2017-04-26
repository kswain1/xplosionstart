#!/usr/bin/node
// # client.js
const WebSocket = require('uws');
var PythonShell = require('python-shell');
process.chdir(__dirname)
// When a WebSocket client connection drops, it needs to be recreated. The `initialize` function does that:

var ws;
function initialize() {
  ws = new WebSocket('ws://smartbat.herokuapp.com/'); // Port 3000 is defined in server.js - you can change it if you like

  // Set up a callback so we can respond when the connection with the server has been established:

  ws.on('open', () => {
    console.log('Connected.');
    ws.send(JSON.stringify({msg: 'sensor ready'}));
  });

  // Set up a callback so that if the connection is closed, for example when you restart the server, or if your
  // connection drops, then a reconnection attempt will take place:

  ws.on('close', (e) => {
    console.log('Disconnected.');
    reconnect();
  });

  // This callback is where you need to respond to the start or stop request coming from the server.

  ws.on('message', (data, flags) => {
    data = new Buffer(data.toString());
    data = JSON.parse(data);    
    //data = JSON.parse(Buffer.from(data).toString());
    console.log('Received from server:', data);
    var script = new PythonShell("swing_velocity_rest.py");
    switch(data.msg) {
      case 'start':
        // TO DO: Activate the sensor
        console.log('The sensor has been activated');
	script.send('open');
        script.end(function (err) {
          if (err) throw err;
          console.log('finished');
          }); 
        // end the input stream and allow the process to exit
	       break;

      case 'stop':
        // TO DO: Deactivate the sensor
        console.log('The sensor has been deactivated');
	script.send('close'); 
        PythonShell.run('/etc/init.d/test.py', function (err) {
    	if (err) throw err;
   	      console.log('finished');
  	     });

	     break;
    }
	// end the input stream and allow the process to exit
     script.end(function (err) {
  	   if (err) throw err;
  	   console.log('finished');
	   });
  });

  ws.on('error', (e) => {
    console.log('Connection error:', e);
    reconnect();
  });
}

// This function triggers reconnection by recreating and reinitializing the WebSocket client instance:

function reconnect() {
  setTimeout(initialize, 500); // Attempt to reconnect every 500ms
}

// Finally, get the ball rolling:

initialize();
