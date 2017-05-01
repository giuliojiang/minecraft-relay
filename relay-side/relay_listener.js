var net = require("net");
var rawconf = require("rawconf");

var data_encoder = require(__dirname + "/data_encoder.js");
var sessions = require(__dirname + "/sessions.js");

var server_side_socket = null;

// //////////
// Public methods
// //////////

module.exports.start = function() {
    var config = rawconf.get_config();

    net.createServer((socket) => {
        
        server_side_socket = socket;
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        
        console.log("Server side connected from: " + socket.name);
        
        // Handle incoming data
        socket.on("data", (data) => {
            console.log("Data from tunnel ["+data+"]");
            // Decode data and send to relevant client
            var decoded_data = data_encoder.receive_data(data);
            if (!decoded_data) {
                return;
            } else {
                console.log("Got a decode");
                if (decoded_data[0] == 999999) {
                    // close connection message
                    var disconnecting_client = parseInt(decoded_data[1]);
                    console.log("Disconnecting client ["+disconnecting_client+"]");
                    sessions.close_client_connection(disconnecting_client);
                } else {
                    sessions.send_to_client(decoded_data[0], decoded_data[1]);
                    return; 
                }
            }
        });
        
        // Connection close
        socket.on("end", () => {
            server_side_socket = null;
            console.log("Server side disconnected ["+socket.name+"]");
        });
        
    }).listen(config.relay_tunnel_port, "::");

};

module.exports.send = function(data) {
    if (server_side_socket) {
        server_side_socket.write(data);
    } else {
        console.log("Tried to send through tunnel, but tunnel connection is not open ["+data+"]");
    }
};

