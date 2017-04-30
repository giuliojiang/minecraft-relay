/*

Manages the connected clients

Bi-map from 
    socket.name -> [socket, clientnumber]
    
When a client connects:
- generate socket name, add to the map, make new client number, increase counter

When a client sends data:
- make_tunnel_package with clientnumber and data





 * */


var BiMap = require("bimap");

// //////////
// Data
// //////////

var clients = new BiMap;

var next_client_number = 0;

// //////////
// Public methods
// //////////

// Handle a new client that connected
// Generate new sequence number and add to the bidirectional map
var client_connected = function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.setEncoding('utf8');
    
    var current_client_number = next_client_number;
    next_client_number += 1;
    
    clients.push(socket.name, [socket, current_client_number]);
};

// Receive data from a client
// Package the data and send through the relay
var client_data = function(socket, data) {
    var clientinfo = clients.key(socket.name);
    var clientnumber = clientinfo[1];
    var datablock = data_encoder.package_data(data, clientnumber);
    // TODO send through relay
};

// Send packaged data to client
var send_to_client = function(clientnumber, clear_data) {
    var clientname = clients.val(clientnumber);
    var clientsocket = clients.key(clientname);
    clientsocket.write(clear_data);
};

// Client disconnected
var client_disconnected = function(socket) {
    clients.removeKey(socket.name);
};

// //////////
// Private methods
// //////////

