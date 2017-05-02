/*
Message format

XXXXXXYYYYYYdata
XXXXXX clientnumber
YYYYYY datalength (not including headers)



Buffers:
Map 
    clientnumber -> partial data (string)
Remembers the received data until length is enough to generate the block
to be sent to client
*/

var sessions = require(__dirname + "/sessions.js");

// //////////
// Buffers
// //////////

var buf = "";

// //////////
// Public methods
// //////////

var number_length = 6;
var header_length = 12;

var format_number_length = function(num) {
    var r = "" + num;
    if (r.length > number_length) {
        throw "Error! Number overflowed allowed length " + num;
    }
    while (r.length < number_length) {
        r = "0" + r;
    }
    return r;
};

// Create the packaged data to be sent through the tunnel
var package_data = function(data_in, clientnumber) {
    var data = data_in;
    var length = data.length;
    var res = format_number_length(clientnumber) + format_number_length(length) + data;
    return res;
};

// Receive some data from the tunnel
// Returns [clientnumber, decodeddata] or null if not enough data received
var receive_data = function(data) {
    buf += data;
    return try_parse();
};

// //////////
// Private methods
// //////////

var try_parse = function() {
    var res = [];
    var one_block = parse_one();
    while (one_block) {
        res.push(one_block);
        one_block = parse_one();
    }
    return res;
};

var parse_one = function() {
    if (buf.length >= header_length) {
        var clientnumber_str = buf.substring(0, 6);
        var datalength_str = buf.substring(6, 12);

        // Try to parse the client number
        var clientnumber = parseInt(clientnumber_str);
        if (isNaN(clientnumber)) {
            console.log("could not parse client number");
            buf = buf.substring(1);
            return parse_one();
        }
        
        // Try to parse the data length string
        var datalength = parseInt(datalength_str);
        if (isNaN(datalength)) {
            console.log("could not parse data length");
            buf = buf.substring(1);
            return parse_one();
        }
        
        var data_str_len = buf.length - 12;

        if (data_str_len < datalength) {
            // not enough data received, do nothing for now
            return null;
        } else {
            // need to substring the first part of data
            // and remember the rest in the buffer
            var current_data_block = buf.substring(12, datalength + 12);
            buf = buf.substring(datalength + 12);

            return [clientnumber, current_data_block];
        }
    }
};

// //////////
// Exports
// //////////

module.exports = {
    package_data: package_data,
    receive_data: receive_data,
    format_number_length: format_number_length
}