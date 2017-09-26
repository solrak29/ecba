//
//    mycouperwatson.js
//
//    Watson interface to conversation and discovery
//
//    Auth: solrak29@yahoo.com (carlos) (c) May 2017
//
var watson = require('watson-developer-cloud');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var parseJson = require('parse-json');
var msgEvent = require( './mycoupeMsgEvent.js' );

var collection_id = "b4d6c204-c06c-4e46-a19a-867baa213207";
var environment_id = "0e8550de-d5f8-42ba-9908-7ef0d7b09ccf";

exports.send = send;
exports.sendMsg = sendMsg;

var discoveryCred1 = {
    username : "fe67a5ff-5bbf-4d14-9442-9067dcc1e8b9",
    password: "WCE1QZluc2Vg",
    version: 'v1',
    version_date: '2016-12-01'
}

var discovery = new DiscoveryV1(discoveryCred1);

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
    username: 'affd257a-84c2-4ea8-b4f3-715782634f07',
    password: '7rXgsx1itVBQ',
    path: { workspace_id: 'efca499d-7da2-49f4-9098-819f3a7c496c' },
    version_date: '2017-02-03'
});

const disc_environment_id ='82a39288-7b11-449d-bae1-7309b05d9663';
const disc_collection_id ='751e4206-6fb0-4ade-a63e-b5f9d2c9bf74';

var params = {
  cluster_id: 'scb448568d_0405_4bd6_be54_41623f8e63c3',
  collection_name: 'mycoopfaq',
  wt: 'json'
};

//
//  global tracking of users using watson
//
var usersOnline = {};

function sendMsg( userdetails, msg, callback ) {
    var context;
    console.log("mycouperwatson::sendMsg");
    console.log("  Sending message to watson: " + msg + "For user " + userdetails.username);
    if ( usersOnline[userdetails.userID] ) {
    } else {
        console.log("  Error: function called in wrong context skipping call");
        return;
    }

    var context = {
        "input" : { text: msg },
        "context" : {
            conversation_id : usersOnline[userdetails.userID].conversation_id,
	    system : usersOnline[userdetails.userID].system,
            user_name : userdetails.username,
            user_id : userdetails.userID 
        }
    };

    console.log("  System that I saved: " + JSON.stringify(usersOnline[userdetails.userID].system));
    console.log("  Sending context to watson: " + JSON.stringify(context));

    conversation.message(context, function(err, response ) {
        if ( err ) {
            console.log(err);
        } else {
            console.log( JSON.stringify(response, null, 2 ));
            // Check the intent; if we get faq we need check disovery
	    if ( response.intents.length ) {
	        console.log("Received intent " + response.intents[0].intent);
	        if ( response.intents[0].intent === "faq" ) {
	            console.log("Checking discovery for details");
		    discovery.query( { environment_id: environment_id,
		                       collection_id: collection_id,
				       query: "rent due" }, function( error, data) {
                        console.log(JSON.stringify(data, null, 2));
                        userdetails.chatcontext = response.context;
                        msg = new msgEvent.Msg(userdetails.userID);
                        msg.setEventSender("IBM");
                        msg.setRecipient( userdetails.recID);
                        // there can be multiple lines of text here...
                        // text is an array...
                        if ( data && data.results.length ) {
                            msg.setMsgRecieved( data.results[0].answer );
                        } else {
                            msg.setMsgRecieved( "Not sure..." );
                        }
                        msg.setUserDetails( userdetails );
                        msg.setRecipient( userdetails.recID);
                        usersOnline[userdetails.userID] = { conversation_id: response.context.conversation_id,
                                            system: response.context.system };
                        console.log( "Recieved details from coversation...");
                        callback(msg);
		    });
	        } else {
	            console.log("Responding");
                    userdetails.chatcontext = response.context;
                    msg = new msgEvent.Msg(userdetails.userID);
                    msg.setEventSender("IBM");
                    msg.setRecipient( userdetails.recID);
                    // there can be multiple lines of text here...
                    // text is an array...
                    msg.setMsgRecieved( response.output.text );
                    msg.setUserDetails( userdetails );
                    msg.setRecipient( userdetails.recID);
                    usersOnline[userdetails.userID] = { conversation_id: response.context.conversation_id,
                                            system: response.context.system };
                    console.log( "Recieved details from coversation...");
                    callback(msg);
                }
	    } else {
	        console.log("No intent found");
	    }
        }
    });
}

//
// function called for initial interaction with watson
//
function send( userdetails, callback ) {
    var context = {
        "context" : {
            user_name : userdetails.username,
            user_id : userdetails.userID
        }
    };
    conversation.message(context, function(err, response ) {
        console.log( JSON.stringify(response, null, 2 ));
        userdetails.chatcontext = response.context;
        msg = new msgEvent.Msg(userdetails.userID);
        msg.setEventSender("IBM");
        msg.setRecipient( userdetails.recID);
        msg.setMsgRecieved( response.output.text[0] );
        msg.setUserDetails( userdetails );
        msg.setRecipient( userdetails.recID);
        usersOnline[userdetails.userID] = { conversation_id: response.context.conversation_id,
                                            system: response.context.system };
        console.log( "Recieved details from coversation...");
        callback(msg);
    });
}



