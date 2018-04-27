//
//    message.js
//
//    This class/module will provide a standard message format to be
//    used withing the system.

const _util = require('util');
exports.createECBAMessage = createECBAMessage;
module.export = ECBAMessage;

function createECBAMessage(type) {
    return new ECBAMessage( type );
}

function ECBAMessage(type) {
    console.log("Creating ECBAMessage...");
    if ( !type ) {
        throw new Error("Concrete type require to create Message object");
    }
    var me = this;
    me.version = "1.0.0.0";
    me.type=type; 
    me.msgText = "";
    me.to = "";
    me.from = "";
    me.timestamp = ""
}

ECBAMessage.prototype.getMsg() = function() {
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
    console.log( this.type + " Received message " + msg );
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
