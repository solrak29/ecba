//
//  facebook.test.js
//
//  test code to test the interface to facebook chat
//
//
console.log("Testing Facebook Modules, Classes, and Configurations");
facebook = require('../facebook');
console.log( "Using fb version : " + facebook.version);
const util = require('util');

console.log( "Checking configuration object: " + util.inspect(facebook, false, null));
console.log("Checking type 1 " + typeof(facebook));
console.log("Checking type 2 " + typeof(facebook.createFacebook));

function callback(fb, msg) {
    console.log( util.inspect(msg, false, null));
    console.log( "In client call back recieve message type : " + msg.getMsgType());
    console.log( "Received message from : " + msg.userid);
    if ( msg.msgType == "MSG" ) {
        console.log( "Receive message event : " + msg.msgType);
        console.log( "Received message at ( " + msg.msgtime + " ) : " + msg.msgtext );
    } else {
        console.log( "Receive message event : " + msg.msgType);
    }

}
var fb = facebook.createFacebook(callback);
