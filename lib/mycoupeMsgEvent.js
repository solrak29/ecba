//
//    mycoupeMsgEvent.js
//
//    This is "class" that will hold all the details of message from a chat interface
//
//    Auth: solrak29@yahoo.com (carlos) (c) May 2017
//

exports.Msg = Msg;

function Msg( senderID ) {
    this.senderID = senderID;
};

Msg.prototype.setEventSender = function( sender ) {
    this.eventFrom = sender;
};

Msg.prototype.getEventSender = function() {
    return this.eventFrom;
};

Msg.prototype.getSenderID = function () {
    return this.senderID;
};

Msg.prototype.setUserDetails = function( userdetails ) {
    this.userdetails = userdetails;
};

Msg.prototype.getUserDetails = function() {
    return this.usderdetails;
};

Msg.prototype.setRecipient = function ( receiver ) {
    this.receiver = receiver;
};

Msg.prototype.getRecipient = function () {
    return this.receiver;
};

Msg.prototype.setTimeStamp = function( timestamp ) {
   this.timestamp = timestamp;
}

Msg.prototype.setMsgRecieved = function( msg ) {
    console.log("mycoupeMsgEvent::setMsgRecieved");
    if ( Array.isArray(msg) ) {
        console.log("Found multi-line array");
        for(var i = 0; i < msg.length; i++ ) {
            if ( i == 0 ) {
                this.msg = msg[i];
            } else {
                this.msg = this.msg + msg[i];
            }
        }
    } else {
        console.log( "Single line text");
	this.msg = msg;
    }
    console.log( "Creating event by adding msg " + this.msg );
};

Msg.prototype.getMsg = function () {
    return this.msg;
};

Msg.prototype.getMsgID = function ( ) {
    return this.msg.mid;
};

Msg.prototype.getAppID = function () {
    return this.msg.app_id;
};

Msg.prototype.isEcho = function () {
    return this.msg.is_echo;
};

Msg.prototype.getMetaData = function () {
    return this.msg.metadata;
};

Msg.prototype.getMessageText = function () {
    if (this.msg.text) {
        return this.msg.text; // from fb it's stored here
    } else {
        return this.msg; // from watson its stored here
    }
};

Msg.prototype.getMessageAttachments = function () {
    return this.msg.attachments;
};

Msg.prototype.getQuickReply = function () {
    return this.msg.quick_reply;
};
