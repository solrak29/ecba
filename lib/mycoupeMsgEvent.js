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
}

Msg.prototype.getSenderID = function () {
    return this.senderID;
};

Msg.prototype.setSender = function ( sender ) {
    this.sender = sender;
};

Msg.prototype.getSender = function () {
    return this.sender;
};

Msg.prototype.setTimeStamp = function( timestamp ) {
   this.timestamp = timestamp;
}

Msg.prototype.setMsgRecieved = function( msg ) {
    this.msg = msg;
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
    return this.msg.text;
};

Msg.prototype.getMessageAttachments = function () {
    return this.msg.attachments;
};

Msg.prototype.getQuickReply = function () {
    return this.msg.quick_reply;
};
