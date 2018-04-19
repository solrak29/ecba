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
    console.incoming = new stream( { objectMode: true } );
    console.incoming._transform = console._received.bind(console);
    return console;
}

function createECBAConsoleBot() {
    var console = new ECBAConsole( AS_BOT );
    console.incoming = new stream( { objectMode: true });
    console.incoming._transform = console._received.bind(console);
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

ECBAConsole.prototype._received = function( msg, _, _ ) {
    this.buffer = msg;
    //console.log( "["+ this.type + ":stream] " + msg);
    this.callback(msg);
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
        this.readconsole.setPrompt(CHAT_PROMPT);
        //
        // Captures when a line comes through
        //
        this.readconsole.on('line', (input) => {
            var msg = input;
            //console.log( "["+this.type+"]" + " Received: " + msg );
            this.incoming.push(msg);
            this.readconsole.prompt([true]);
        });

        this.readconsole.on('error', (error) => {
            throw(error);
        });

        this.readconsole.on('close', () => {
            console.log("Chat Conneciton Closed");
        });
        this.readconsole.on('pause', () => {
            console.log("Chat paused");
        });

        //
        // Bot will never prompt for ouput it will always require an interface
        //
        this.readconsole.prompt([true]);
    } 
    //console.log( "["+this.type+"] Started...");
}

ECBAConsole.prototype.startChat = function(client, callback, errhandler) {
    //console.log( this.type + " - Starting chat...");
    this.state = CHAT_STARTED;
    if ( client ) {
        this.addClient(client);
        this.callback = callback;
        this.errhandler = errhandler;
        this.chat();
    } else {
        throw new Error( "No client defined before starting chat");
    }
}

ECBAConsole.prototype.addClient = function ( client ) {
    //console.log("Adding client..." + typeof(client));
    this.incoming.pipe(client.incoming);
}

ECBAConsole.prototype.addCallback = function( callback ) {
    this.callback = callback;
}

ECBAConsole.prototype.sendMsg = function(msg) {
    this.incoming.push(msg);
}
