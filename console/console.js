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

const AS_CHAT="AS_CHAT";
const AS_BOT="AS_BOT";

function createECBAConsoleChat() {
    var console = new ECBAConsole( AS_CHAT);
    return console;
}

function createECBAConsoleBot() {
    var console = new ECBAConsole( AS_BOT );
    return console;
}

function ECBAConsole(type) {
    console.log("Creating ECBAConsole...");
    var me = this;
    me.version = "1.0.0.0";
    me.type=type; 

    if ( consoleconfig.console_remote == "True" ) {
        console.log("Not implemented yet");
        process.exit(1);
    } else {
        me.readconsole = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
            hisotrySize: 100, 
            removeHistoryDuplicates: true
        });
        if (me.type == AS_BOT) {
            me.readconsole.setPrompt("BOT CONSOLE :");
        } else {
            me.readconsole.setPrompt("CHAT CONSOLE :");
        }
        me.readconsole.on('line', (input) => {
            var msg = input;
            console.log( me.type + " Readobject: " + msg );
        });

        if ( me.type = AS_CHAT ) {
            me.readconsole.prompt([true]);
        }
    }
}

ECBAConsole.prototype.addClient = function ( client ) {
    this.client = client;
    this.clientcallback = client.sourcecallback;
}

ECBAConsole.prototype.sendMsg = function(msg) {
    this.client.readconsole.write(msg);
}

ECBAConsole.prototype.sourcecallback = function( msg) {
    console.log( this.type + "Received : " + msg );
}

