// Listens to client connections

var net = require("net");
var rawconf = require("rawconf");

var sessions = require(__dirname + "/sessions.js");

var start = function() {
    var config = rawconf.get_config();

    net.createServer((socket) => {
        
        socket.setEncoding("hex");
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        sessions.client_connected(socket);

        // Handle incoming data
        socket.on("data", (data) => {
            sessions.client_data(socket, data);
        });
        
        // Connection close
        socket.on("end", () => {
            sessions.client_disconnected(socket);
        });
        
    }).listen(config.relay_port, "0.0.0.0");

};

module.exports = {
    start: start
};