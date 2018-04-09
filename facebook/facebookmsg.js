//
//    facebookmsg.js
//
//    Facebook message object to store the details of a message that comesback from facebook 
//    and used to send message.
//
//    carlos <solrak29@yahoo.com> 2018(c)

const util = require('util');
exports.createFBMessage = createFBMessage;
module.export = FacebookMsg;

function createFBMessage(req) {
    return new FacebookMsg(req);
}

function FacebookMsg(request) {
    this.request = request;
    //this.msgType = "NA";
    //this.userid = "NA";
    //this.processMessage(request);
}

FacebookMsg.prototype.getMsgType = function() {
    return this.msgType;
}

FacebookMsg.prototype.processMessage = function( request ) {
    var me = this;
    //console.log("Request received: " + util.inspect(request, false, null) );
    //console.log( JSON.stringify(data) ); // for debugging
    if ( request.object == 'page') {
        console.log("Processing Facebook Message");
        //
        //  Facebook may batch messages so you have to iterate, in general it is one entry.
        //
        request.entry.forEach( function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            pageEntry.messaging.forEach( function(messageEvent) {
                me.userid = messageEvent.sender.id; // sender or user chatting
                me.pageid = messageEvent.recipient.id; // the fb page app this chat bot
                
                // message events
                if ( messageEvent.optin) {
                    console.log("Received Optin Event -- skipping");
                    me.msgType = "OPTIN";
                } else if ( messageEvent.message) {
                    console.log("Received Message Event -- processing");
                    me.msgType = "MSG";
                    me.msgtime = messageEvent.timestamp;
                    me.msgtext = messageEvent.message.text;
                } else if ( messageEvent.delivery ) {
                    console.log("Received Delivery Confirmation -- processing");
                    me.msgType = "ACK";
                } else if ( messageEvent.postback) {
                    console.log("Received Post Back -- skipping" );
                    me.msgType = "POST_BACK";
                } else if ( messageEvent.read ) {
                    console.log("Received Read Event -- processing");
                    me.msgType = "READ";
                } else if ( messageEvent.account_linking ) {
                    console.log("Received Account Linking Event -- skipping");
                    me.msgType = "ACCOUNT_LINKING";
                } else {
                    console.log("Received Unkown Event");
                    me.msgType = "UNKNOWN";
                }
            }); // end for each 
        }); // end for each
    } else {
        console.log(" Recieved a non-page event ");
        me.msgType = "UNKNOWN";
    }
}

