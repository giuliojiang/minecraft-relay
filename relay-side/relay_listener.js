var net = require("net");
var rawconf = require("rawconf");

var data_encoder = require(__dirname + "/data_encoder.js");

var server_side_socket = null;

// //////////
// Public methods
// //////////

var start = function() {
    var config = rawconf.get_config();

    net.createServer((socket) => {
        
        server_side_socket = socket;
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        
        console.log("Server side connected from: " + socket.name);
        
        // Handle incoming data
        socket.on("data", (data) => {
            // Decode data and send to relevant client
            data_encoder.receive_data(data);
        });
        
        // Connection close
        socket.on("end", () => {
            server_side_socket = null;
            console.log("Server side disconnected ["+socket.name+"]");
        });
        
    }).listen(config.relay_tunnel_port);

};

var send = function(data) {
    if (server_side_socket) {
        server_side_socket.write(data);
    } else {
        console.log("Tried to send through tunnel, but tunnel connection is not open ["+data+"]");
    }
};


module.exports = {
    start: start,
    send: send
};