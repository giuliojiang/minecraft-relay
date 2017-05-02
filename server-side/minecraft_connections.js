/*

Holds a map of minecraft TCP connections on localhost

Map
    client number -> socket

*/

var net = require("net");
var async = require("async");

var rawconf = require("rawconf");
var config = rawconf.get_config();
var tunnel = require(__dirname + "/tunnel.js");
var data_encoder = require(__dirname + "/../relay-side/data_encoder.js");

// //////////
// Data
// //////////

var clients = {};

// //////////
// Public methods
// //////////

module.exports.communicate = function(client_number, data) {
    if (!clients[client_number]) {
        
        var new_client = new net.Socket();

        new_client.connect(config.minecraft_server_port, "127.0.0.1", function() {
            console.log("Client ["+client_number+"] connected to minecraft server");
            new_client.setEncoding("hex");
            new_client.setNoDelay(true);
        });
        
        
        // TODO check correctness, due to closure's value of new_client
        new_client.on("data", function(data) {
            async.setImmediate(function() {
                tunnel.data_from_client(client_number, data);
            });
        });
        
        new_client.on("close", function() {
            console.log("Minecraft server disconnected ["+client_number+"]");
            console.log("Sending disconnect through tunnel");
            new_client.destroy();
            console.log(tunnel.connect);
            tunnel.data_from_client(999999, data_encoder.format_number_length(client_number)); // Special close connection message
        });
        
        new_client.on("error", function() {});

        clients[client_number] = new_client;
        
    }

    try {
        clients[client_number].write(data, "hex");
    } catch (err) {
        console.log(err);
    }


};

module.exports.force_disconnect_number = function(connection_number) {
    var client_socket = clients[connection_number];
    if (!client_socket) {
        console.log("Tried to disconnect connection ["+connection_number+"] but didn't find it in the mapping");
        return;
    }
    
    client_socket.destroy();
    delete clients[connection_number];
};

// //////////
// Private methods
// //////////
