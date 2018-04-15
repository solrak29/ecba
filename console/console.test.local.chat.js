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

console.log( "Connecting chat and bot together...");
console_chat.addClient( console_bot );
//console_bot.addClient( console_chat );
console.log( "Starting chat test phase one; type anything at chat...");
console_chat.startChat( function(err){
    if ( err.message == "Client is not listening" ) {
        console.log("Phase 1: Passed");
    } else {
        console.log("Phase 1: Failed");
    }
        
});
