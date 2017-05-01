// Handle a new client that connected
// Generate new sequence number and add to the bidirectional map
var client_connected = function(socket) {
    console.log("Session mock: client connected");
};

// Receive data from a client
// Package the data and send through the relay
var client_data = function(socket, data) {
    console.log("Session mock: client data");
};

// Send packaged data to client
var send_to_client = function(clientnumber, clear_data) {
    console.log("Session mock: send to client");
};

// Client disconnected
var client_disconnected = function(socket) {
    console.log("Client disconnected");
};

module.exports = {
    client_connected: client_connected,
    client_data: client_data,
    send_to_client: send_to_client,
    client_disconnected: client_disconnected
};