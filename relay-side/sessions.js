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
var relay_listener = require(__dirname + "/relay_listener.js");
var data_encoder = require(__dirname + "/data_encoder.js");

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
module.exports.client_connected = function(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    
    var current_client_number = next_client_number;
    next_client_number += 1;
    
    console.log("Connected client ["+socket.name+"]");
    
    clients.push(socket.name, [socket, current_client_number]);
};

// Receive data from a client
// Package the data and send through the relay
module.exports.client_data = function(socket, data) {
    var clientinfo = clients.key(socket.name);
    var clientnumber = clientinfo[1];
    var datablock = data_encoder.package_data(data, clientnumber);
    relay_listener.send(datablock);
};

// Send packaged data to client
module.exports.send_to_client = function(clientnumber, clear_data) {
    var clientname = clients.val(clientnumber);
    if (!clientname) {
        throw new Error("Could not find client number ["+clientnumber+"]");
    }
    
    var clientsocket = clients.key(clientname)[0];
    if (!clientsocket) {
        throw new Error("Could not find client socket by name ["+clientname+"]");
    }

    clientsocket.write(clear_data, "hex");
};

// Client disconnected
module.exports.client_disconnected = function(socket) {
    clients.removeKey(socket.name);
};

// Disconnect from server side
module.exports.close_client_connection = function(cid) {
    var cname = clients.val(cid);
    var csocket = clients.key(cname)[0];
    csocket.destroy();
    clients.removeKey(cname);
};

// //////////
// Private methods
// //////////
