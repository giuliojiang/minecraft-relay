var net = require("net");

// listen from client

var client_socket = null;

var server = net.createServer(function(socket) {
    client_socket = socket;
    
    socket.setEncoding("hex"); // Use Buffer objects
    
    socket.on("data", (data) => {
        console.log("Client sent ["+(typeof data)+"] ["+data+"]");
        mc.write(data, "hex");
    });
    
    socket.on("end", () => {
        console.log("Client ended connection");
    });
}).listen(23100, "0.0.0.0");

// connect to minecraft

var mc = new net.Socket();

mc.connect(25565, "127.0.0.1", function() {
    console.log("connected to minecraft");
});

mc.setEncoding("hex");

mc.on("data", function(data) {
    console.log("Minecraft sent ["+(typeof data)+"] ["+data+"]");
    client_socket.write(data, "hex");
});
