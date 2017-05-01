var async = require("async");
var jassert = require("jassert.js");

var test_testsuite = require(__dirname + "/test_testsuite.js");

async.waterfall([

    // Run all tests
    function(callback) {
        async.each(test_testsuite.tests, (test, callback) => {
            test((err, res) => {
                async.setImmediate(() => {
                    callback(err, res);
                    return;
                });
            });
        }, function(err) {
            callback(err);
        });
    }

], (err, res) => {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log("TESTSUITE completed");
        console.log(jassert.format());
        process.exit(jassert.all_tests_passed ? 0 : 1);
    }
});
