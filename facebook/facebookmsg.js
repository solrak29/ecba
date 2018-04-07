//
//    facebookmsg.js
//
//    Facebook message object to store the details of a message that comesback from facebook 
//    and used to send message.
//
//    carlos <solrak29@yahoo.com> 2018(c)

exports.createFBMessage = createFBMessage;
module.export = FacebookMsg;

function createFBMessage(req) {
    return new FacebookMsg(req);
}

function FacebookMsg(request) {
    this.request = request;
    this.processMessage(request).bind(this); 
}

FacebookMsg.prototype.processMessage = function( request ) {
    var data = request.body;
    //console.log( JSON.stringify(data) ); // for debugging
    if ( data.object == 'page') {
        consloe.log("Processing Facebook Message");
        //
        //  Facebook may batch messages so you have to iterate, in general it is one entry.
        //
        data.entry.forEach( function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            pageEntry.messaging.forEach( function(messageEvent) {
                this.userid = messageEvent.sender.id; // sender or user chatting
                this.pageid = messageEvent.recipient.id; // the fb page app this chat bot
                
                // message events
                if ( messageEvent.optin) {
                    console.log("Received Optin Event -- skipping");
                    this.msgType = "OPTIN";
                } else if ( messageEvent.message) {
                    console.log("Received Message Event -- processing");
                    this.msgType = "MSG";
                    this.msgtime = messageEvent.timestamp;
                    this.msgtext = messageEvent.message.text;
                } else if ( messageEvent.delivery ) {
                    console.log("Received Delivery Confirmation -- processing");
                    this.msgType = "ACK";
                } else if ( messageEvent.postback) {
                    console.log("Received Post Back -- skipping" );
                    this.msgType = "POST_BACK";
                } else if ( messageEvent.read ) {
                    console.log("Received Read Event -- processing");
                    this.msgType = "READ";
                } else if ( messageEvent.account_linking ) {
                    console.log("Received Account Linking Event -- skipping");
                    this.msgType = "ACCOUNT_LINKING";
                } else {
                    console.log("Received Unkown Event");
                    this.msgType = "UNKNOWN";
                }
            }); // end for each 
        }); // end for each
    } else {
        console.log(" Recieved a non-page event ");
        this.msgType = "UNKNOWN";
    }
}

