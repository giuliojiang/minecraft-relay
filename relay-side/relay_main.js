var rawconf = require("rawconf");
var async = require("async");

async.waterfall([

    // Setup configuration file
    function(callback) {
        rawconf.set_configuration_file(1, "/config/config.json", (err) => {
            if (err) {
                callback(err);
                return;
            }
            
            console.log("Configuration file successfully loaded");
            
            async.setImmediate(() => {
                callback(null);
            });
            return;
        });
    },
    
    // Start the external network listener
    function(callback) {
        
        var listener = require(__dirname + "/listener.js");
        listener.start();
        
        console.log("Listener module loaded");
        
        async.setImmediate(() => {
            callback(null);
        });
        return;
    },
    
    // Start the tunnel network listener
    function(callback) {
        console.log("Tunnel network listener not implemented yet");
        
        async.setImmediate(() => {
            callback(null);
        });
        return;
    }

], (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("All components started");
    }
});
