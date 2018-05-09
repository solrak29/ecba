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
const prompt = require('prompt');
const colors = require('colors/safe');
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

ECBAConsole.prototype._received = function( msg, _, done ) {
    this.buffer = msg;
    console.log("Calling callback");
    //console.log( "["+ this.type + ":stream] " + msg);
    this.callback(msg);
    done();
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
    if ( this.type == AS_CHAT ) {
        prompt.message  = colors.green("CHAT_PROMPT");
        prompt.delimiter = colors.green(">");
        prompt.start();
        prompt.get( ['msg'], this.callback );
    } 
}

ECBAConsole.prototype.startChat = function( msghandler, errhandler) {
    if ( msghandler && errhandler ) {
        this.state = CHAT_STARTED;
        this.callback = msghandler
        this.errhandler = errhandler;
        this.chat();
    } else {
        throw new Error ("Not all message handlers defined for function");
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
    console.log( this.type + " Received message " + msg.getMsg() );
    if (this.type == AS_BOT ) {
        prompt.message  = colors.blue(BOT_PROMPT);
        prompt.delimiter = colors.blue(">");
    } else {
        prompt.message  = colors.green(CHAT_PROMPT);
        prompt.delimiter = colors.green(">");
    }
    prompt.start();
    prompt.get( ['msg'], this.callback );
}
