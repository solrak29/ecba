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

function ECBAMessage(type ) {
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

ECBAMessage.prototype.setMsg = function(message) {
    this.msgStrategy = message;
    this.msgText = this.msgStrategy.getMsg();
    this.to = this.msgStrategy.getTo();
    this.from = this.msgStrategy.getFrom();
    this.timestamp = this.msgStrategy.getTimeStamp();
}

ECBAMessage.prototype.setUserId = function(userid) {
    this.userid = userid;
}

ECBAMessage.prototype.getMsg = function() {
    if ( this.msgStrategy ) {
        return this.msgText;
    } else {
        throw new Error( "No Strategy provided" );
    }
}
