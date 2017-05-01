/*

Holds a map of minecraft TCP connections on localhost

Map
    client number -> socket

*/

var net = require("net");

var rawconf = require("rawconf");
var config = rawconf.get_config();
var tunnel = require(__dirname + "/tunnel.js");

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
        
        new_client.setEncoding("hex");
        
        new_client.connect(config.minecraft_server_port, "127.0.0.1", function() {
            console.log("Client ["+client_number+"] connected to minecraft server");
            new_client.write(data, "hex");
        });
        
        
        // TODO check correctness, due to closure's value of new_client
        new_client.on("data", function(data) {
            tunnel.data_from_client(client_number, data);
        });
        
        new_client.on("close", function() {
            console.log("Minecraft server disconnected ["+client_number+"]");
            new_client.destroy();
            console.log(tunnel.connect);
            tunnel.data_from_client(999999, ("" + client_number)); // Special close connection message
        });
        
        clients[client_number] = new_client;
        
    } else {
        clients[client_number].write(data, "hex");
    }

};

// //////////
// Private methods
// //////////
