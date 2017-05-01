var net = require("net");
var rawconf = require("rawconf");

var data_encoder = require(__dirname + "/../relay-side/data_encoder.js");
var minecraft_connections = require(__dirname + "/minecraft_connections.js");

// //////////
// Data
// //////////

var client = null;

// //////////
// Public methods
// //////////

module.exports.connect = function() {
    
    var config = rawconf.get_config();
    
    client = new net.Socket();
    
    client.setEncoding("utf8");
    
    if (!config.relay_tunnel_port) {
        throw new Error("relay_tunnel_port configuration not set");
    }
    
    if (!config.relay_address) {
        throw new Error("relay_address configuration not set");
    }
    
    client.connect(config.relay_tunnel_port, config.relay_address, function() {
        console.log("Connected to the relay");
    });
    
    client.on("data", function(data) {
        console.log("Received from Relay: " + data);
        
        // demultiplex and send to minecraft
        var decoded_data = data_encoder.receive_data(data);
        if (!decoded_data) {
            return; // not enough data yet
        } else {
            // send to clients
            var client_number = decoded_data[0];
            var client_data = decoded_data[1];
            minecraft_connections.communicate(client_number, client_data);
        }
    });
    
    client.on("close", function() {
        console.log("Connection to relay closed");
    });
    
};

// Receive data from client. Forward the data in the tunnel
// with the client's number
module.exports.data_from_client = function(client_number, data) {
    // Multiplex and send through tunnel
    var datapackage = data_encoder.package_data(data, client_number);
    client.write(datapackage);
};

