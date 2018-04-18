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

const stream = require('stream').Transform;
const readline = require('readline');
exports.createECBAConsoleChat = createECBAConsoleChat;
exports.createECBAConsoleBot = createECBAConsoleBot;
module.export = ECBAConsole;

const AS_CHAT="AS_CHAT";
const AS_BOT="AS_BOT";
const CHAT_PROMPT="CHAT CONSOLE : ";
const BOT_PROMPT="BOT CONSOLE : ";
const CHAT_CLOSED=2;
const CHAT_STARTED=1;
const CHAT_NOT_STARTED=0;

function createECBAConsoleChat() {
    var console = new ECBAConsole( AS_CHAT);
    console.incoming = new stream();
    return console;
}

function createECBAConsoleBot() {
    var console = new ECBAConsole( AS_BOT );
    console.incoming = new stream();
    return console;
}

function ECBAConsole(type) {
    console.log("Creating ECBAConsole ("+type+")...");
    var me = this;
    me.state=CHAT_NOT_STARTED;
    me.version = "1.0.0.0";
    me.type=type; 

    if ( consoleconfig.console_remote == "True" ) {
        console.log("Not implemented yet");
        process.exit(1);
    }
    
}

ECBAConsole.prototype.isOpen = function() {
    var isopen = false;
    if ( this.state != CHAT_CLOSED ) {
        isopen = true;
    }

    return isopen;
}

ECBAConsole.prototype.stopChat = function() {
    this.readconsole.close();
    this.state = CHAT_CLOSED;
}

ECBAConsole.prototype.chat = function() {
    var config = {};
    if ( this.type == AS_CHAT ) {
        config = {
            input: process.stdin,
            output: process.stdout,
            terminal: false,
            hisotrySize: 100, 
            removeHistoryDuplicates: true
        };
        this.readconsole = readline.createInterface(config);
    } else {
    }


    if (this.type == AS_CHAT) {
        this.readconsole.setPrompt(CHAT_PROMPT);
    }

    //
    // Captures when a line comes through
    //
    this.readconsole.on('line', (input) => {
        var msg = input;
        console.log( "["+this.type+"]" + " Received: " + msg );
        this.readconsole.prompt([true]);
    });

    this.readconsole.on('error', (error) => {
        throw(error);
    });

    this.readconsole.on('close', () => {
        console.log("Chat Conneciton Closed");
    });

    //
    // Bot will never prompt for ouput it will always require an interface
    //
    if ( this.type == AS_CHAT ) {
        this.readconsole.prompt([true]);
    }
}

ECBAConsole.prototype.startChat = function(errhandler, client) {
    console.log( this.type + " - Starting chat...");
    this.state = CHAT_STARTED;
    if ( client ) {
        this.addClient(client);
        this.chat();
    } else {
        throw new Error( "No client defined before starting chat");
    }
}

ECBAConsole.prototype.addClient = function ( client ) {
    console.log("Adding client..." + typeof(client));
    this.client = client;
    this.clientcallback = client.sourcecallback;
}

ECBAConsole.prototype.sendMsg = function(msg) {
    if ( !this.client ) {
        console.log("No client was added...");
        throw new Error("No client was added");
    } else if ( this.client && this.client.state != CHAT_STARTED ) {
        console.log("Client is not listening");
        throw new Error("Client is not listening");
    } else {
        this.client.readconsole.write(msg);
    }
}

ECBAConsole.prototype.sourcecallback = function( msg) {
    console.log( this.type + "Received : " + msg );
}

