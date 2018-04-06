//
//  facebook.test.js
//
//  test code to test the interface to facebook chat
//
//
console.log("Testing Facebook Modules, Classes, and Configurations");
facebook = require('../facebook');
const util = require('util')

console.log( "Checking configuration object: " + util.inspect(facebook, false, null));
console.log("Checking type 1 " + typeof(facebook));
console.log("Checking type 2 " + typeof(facebook.createFacebook));

function callback(fb, msg) {
    console.log( "In client call back : " + msg);
    console.log( "Using fb version : " + fb.version);

}
var fb = facebook.createFacebook(callback);
