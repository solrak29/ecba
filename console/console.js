//
//    console.js
//
//    This class/module will handle receiving and sending chats via console.
//    Thus this module can mimic the bot side and the client side.

try{
    var consoleconfig = require("../config/console.js");
} catch(ex) {
    console.log(ex.message);
}

const readline = require('readline');
exports.createECBAConsoleChat = createECBAConsoleChat;
exports.createECBAConsoleBot = createECBAConsoleBot;
module.export = ECBAConsole;

function createECBAConsoleChat() {
    var console = new ECBAConsole( "AS_CHAT");
    return console;
}

function createECBACConsoleBot() {
    var console = new ECBAConsole( "AS_BOT" );
    return console;
}


function ECBAConsole() {
    console.log("Creating ECBAConsole...");
    var me = this;
    me.version = "1.0.0.0";

    if ( consoleconfig.console_remote == "True" ) {
        console.log("Not implemented yet");
        process.exit(1);
    } else {
        me.readconsole = readline.createInterface({
            input: process.stdiin,
            output: process.stdout
        });
    }
}

ECBAConsole.prototype.sourcecallback = function( msg) {
    console.log( "Console Bot : " + msg.text );
    // wait for input
    //
}

