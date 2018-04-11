//
//  facebook.test.js
//
//  test code to test the interface to facebook chat
//
//

var TestMsg = "[FACEBOOK_TEST_2018_04] ";
console.log(TestMsg + "Testing Facebook Modules, Classes, and Configurations");
facebook = require('../facebook');
console.log( TestMsg + "Using fb version : " + facebook.version);
const util = require('util');

console.log( TestMsg + "Checking configuration object: " + util.inspect(facebook, false, null));
console.log(TestMsg + "Checking type 1 " + typeof(facebook));
console.log(TestMsg + "Checking type 2 " + typeof(facebook.createFacebook));

function callback(fb, msg) {
    console.log( TestMsg + util.inspect(msg, false, null));
    console.log( TestMsg + "In client call back recieve message type : " + msg.getMsgType());
    console.log( TestMsg + "Received message from : " + msg.userid);
    if ( msg.msgType == "MSG" ) {
        console.log( TestMsg + "Receive message event : " + msg.msgType);
        console.log( TestMsg + "Received message at ( " + msg.msgtime + " ) : " + msg.msgtext );
        console.log( TestMsg + "Setting message to what is received");
        msg.setText(TestMsg + "I received your message (" + msg.msgtext + ")");
        fb.sendMessage(msg);
    } else {
        console.log( TestMsg + "Receive message event : " + msg.msgType);
    }
} // end test function call back

var fb = facebook.createFacebook(callback);
