var proxyquire = require("proxyquire");
var jassert = require("jassert.js");

// Setup mockeries
var data_encoder_mocked_libraries = {};
data_encoder_mocked_libraries[__dirname + "/sessions.js"] = require(__dirname + "/test_mock_sessions.js");

// Load data_encoder
var data_encoder = proxyquire(__dirname + "/data_encoder.js", data_encoder_mocked_libraries);

// //////////
// Tests
// //////////

var tests = [];

// package data test
tests.push(function(callback) {
    
    var data = "example.com";
    var cnumber = 23;
    
    var res = data_encoder.package_data(data, cnumber);
    
    jassert.assert_equal_deep("000023000011example.com", res);
    
    callback(null);
});

// //////////
// Exports
// //////////

module.exports = {
    tests: tests
};