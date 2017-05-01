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

    // Connect to the relay
    function(callback) {
        
        var tunnel = require(__dirname + "/tunnel.js");
        
        tunnel.connect();
        
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
