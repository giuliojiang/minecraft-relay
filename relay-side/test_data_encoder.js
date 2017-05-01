var proxyquire = require("proxyquire");
var jassert = require("jassert.js");

// Setup mockeries
var data_encoder_mocked_libraries = {};

var test_mock_session = require(__dirname + "/test_mock_sessions.js");
data_encoder_mocked_libraries[__dirname + "/sessions.js"] = test_mock_session;

// Load data_encoder
var data_encoder = proxyquire(__dirname + "/data_encoder.js", data_encoder_mocked_libraries);

// //////////
// Tests
// //////////

var tests = [];

// package_data test
tests.push(function(callback) {
    
    var data = "example.com";
    var cnumber = 23;
    
    var res = data_encoder.package_data(data, cnumber);
    
    jassert.assert_equal_deep("000023000011example.com", res);
    
    callback(null);
});

// package_data test
tests.push(function(callback) {
    
    var data = "ciao_ciao_qwerty_abcd_faser_enemy_exploit_csrf";
    var cnumber = 23;
    
    var res = data_encoder.package_data(data, cnumber);
    
    jassert.assert_equal_deep("000023000046ciao_ciao_qwerty_abcd_faser_enemy_exploit_csrf", res);
    
    callback(null);
});

// receive_data test
tests.push(function(callback) {
    
    var in_str = "000023000046ciao_ciao_qwerty_abcd_faser_enemy_exploit_csrf";
    
    data_encoder.receive_data(in_str);

    var recd = test_mock_session.get_rec().send_to_client;
    var last_entry = recd[recd.length - 1];
    
    jassert.assert_equal_deep(23, last_entry[0]);
    jassert.assert_equal_deep("ciao_ciao_qwerty_abcd_faser_enemy_exploit_csrf", last_entry[1]);

    callback(null);
});

// Receive data split test
tests.push(function(callback) {
    
    test_mock_session.clear_rec();

    var in_str_1 = "00002300";
    var in_str_2 = "0046ciao_ciao_qwerty_abcd_faser_enemy_exploit_csrf";
    
    data_encoder.receive_data(in_str_1);
    
    // there should have been no calls to send_to_client now
    jassert.assert_equal_deep(0, test_mock_session.get_rec().send_to_client.length);
    
    // now send the second part, which completes the message
    data_encoder.receive_data(in_str_2);
    
    // there should have been 1 call to send_to_client
    var send_to_client_rec = test_mock_session.get_rec().send_to_client;
    var recorded_call = send_to_client_rec[send_to_client_rec.length - 1];
    
    jassert.assert_equal_deep(23, recorded_call[0]);
    jassert.assert_equal_deep("ciao_ciao_qwerty_abcd_faser_enemy_exploit_csrf", recorded_call[1]);
    
    callback(null);
});


// //////////
// Exports
// //////////

module.exports = {
    tests: tests
};