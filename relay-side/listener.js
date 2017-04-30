var net = require("net");
var rawconf = require("rawconf");

var start = function() {
    var config = rawconf.get_config();

    net.createServer((socket) => {
        
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        
        console.log("A new client connected: " + socket.name);
        
        // Handle incoming data
        socket.on("data", (data) => {
            console.log("Received data from ["+socket.name+"] ["+data+"]");
        });
        
        // Connection close
        socket.on("end", () => {
            console.log("Client disconnected ["+socket.name+"]");
        });
        
    }).listen(config.relay_port);

};

module.exports = {
    start: start
};