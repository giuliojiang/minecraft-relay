// Handle a new client that connected
// Generate new sequence number and add to the bidirectional map
var client_connected = function(socket) {
};

// Receive data from a client
// Package the data and send through the relay
var client_data = function(socket, data) {
};

// Send packaged data to client
var send_to_client = function(clientnumber, clear_data) {
    rec.send_to_client.push(arguments);
};

// Client disconnected
var client_disconnected = function(socket) {
};

// //////////
// Recorded data
// //////////

var rec = {};

var clear_rec = function() {
    rec = {};
    rec.send_to_client = [];
};

clear_rec();

var get_rec = function() {
    return rec;
};

// //////////
// Exports
// //////////

module.exports = {
    client_connected: client_connected,
    client_data: client_data,
    send_to_client: send_to_client,
    client_disconnected: client_disconnected,
    
    get_rec: get_rec,
    clear_rec: clear_rec
};