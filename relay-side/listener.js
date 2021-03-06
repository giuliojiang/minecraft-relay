// Listens to client connections

var net = require("net");
var rawconf = require("rawconf");
var async = require("async");

var sessions = require(__dirname + "/sessions.js");

var start = function() {
    var config = rawconf.get_config();

    net.createServer((socket) => {
        
        socket.setEncoding("hex");
        socket.setNoDelay(true);
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        sessions.client_connected(socket);

        // Handle incoming data
        socket.on("data", (data) => {
            async.setImmediate(function() {
                sessions.client_data(socket, data);
            });
        });
        
        // Connection close
        socket.on("end", () => {
            sessions.client_disconnected(socket);
        });
        
        // Errors
        socket.on("error", (err) => {
            console.log("An error occurred in listener.js");
            console.error(err);
        });
        
    }).listen(config.relay_port, "0.0.0.0");

};

module.exports = {
    start: start
};