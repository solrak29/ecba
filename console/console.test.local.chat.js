//
//  console.test.js
//
//  test code to test the console componenet
//
//  carlos <solrak29@yahoo.com>

var testmsg = "[ECBACONSOLE_TEST_2018]";
console.log( testmsg + " Testing Console Component...");
_console = require("../console");

console.log( "Creeating chat interface to talk to Chat Bot simulator...");
console_chat = _console.createECBAConsoleChat();

console.log( "Creeating Bot interface to talk to Chat simulator...");
console_bot = _console.createECBAConsoleBot();

console_chat.startChat( function(err){
    console.log(" CHAT ERROR: " + err );
}, console_bot);

console_bot.startChat( function(err){
    console.log(" CHAT ERROR: " + err );
}, console_chat);
