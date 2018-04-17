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
console_bot.addClient(process.stdout);

//console_bot.addClient( console_chat );
console.log( "Starting chat test phase one; type anything at chat...");
console_chat.startChat( function(err){
    if ( err.message == "Client is not listening" ) {
        console.log("Phase 1: Passed");
        console.log("Wait until console has closed and started Phase 2");
    } else {
        console.log("Phase 1: Failed");
    }
    console_chat.stopChat();
});

function checkconsole() {
    if( console_chat.isOpen() ) {
        setTimeout( checkconsole, 5000);
    } else {
        console.log("Console has been closed");
        console.log("Starting Phase 2");
        console_chat.addClient(console_bot);
        console_chat.startChat( function(err) {
            if ( err.message == "Client is not listening" ) {
                console.log("Phase 2 : Failed");
            } else {
                console.log("Phase 2 : Passed");
            }
        });
    }
}

setTimeout( checkconsole, 5000);

