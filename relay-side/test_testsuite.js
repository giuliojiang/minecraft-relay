var async = require("async");
var jassert = require("jassert.js");

// Test modules
var test_data_encoder = require(__dirname + "/test_data_encoder.js");

var tests = [];

// generate_file_path tests
tests.push(function(callback) {
    async.each(test_data_encoder.tests, (test, callback) => {
        test((err, res) => {
            async.setImmediate(() => {
                callback(err, res);
                return;
            });
        });
    }, function(err) {
        callback(err);
    });
});

module.exports = {
    tests: tests
};
