// Listens on the tunnel (from the server)

var net = require("net");
var rawconf = require("rawconf");
var async = require("async");

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
        
        server_side_socket.setEncoding("hex");
        server_side_socket.setNoDelay(true);
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        
        console.log("Server side connected from: " + socket.name);
        
        // Handle incoming data
        socket.on("data", (data) => {
            async.setImmediate(function() {
                // Decode data and send to relevant client
                var decoded_data_arr = data_encoder.receive_data(data);
                if (decoded_data_arr.length == 0) {
                    return;
                } else {
                    for (var i = 0; i < decoded_data_arr.length; i++) {
                        var decoded_data = decoded_data_arr[i];
                        if (decoded_data[0] == 999999) {
                            // close connection message
                            var disconnecting_client = parseInt(decoded_data[1]);
                            sessions.close_client_connection(disconnecting_client);
                        } else {
                            sessions.send_to_client(decoded_data[0], decoded_data[1]);
                        }
                    }
                }
            });
        });
        
        // Connection close
        socket.on("end", () => {
            server_side_socket = null;
            console.log("Server side disconnected ["+socket.name+"]");
        });
        
    }).listen(config.relay_tunnel_port, "0.0.0.0");

};

module.exports.send = function(data) {
    if (server_side_socket) {
        console.log("to tunnel");
        server_side_socket.write(data, "hex");
    } else {
        console.log("Tried to send through tunnel, but tunnel connection is not open ["+data+"]");
    }
};

