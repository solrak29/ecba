//
//    mycoupefbinterface.js
//    
//    Interfaces with facebook messenger api
//
//    Auth: solrak29@yahoo.com (carlos) (c) Aug 2017
//
var parseJson = require('parse-json');
var request = require('request');
var msgEvent = require( './mycoupeMsgEvent.js' );

exports.processMessage = processMessage;
exports.sendTextMessage = sendTextMessage;
exports.getUserProfile = getUserProfile;

// tbd: move this to configuration
//
// Arbitrary value used to validate a webhook
//const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
//  (process.env.MESSENGER_VALIDATION_TOKEN) :
//  config.get('validationToken');
const VALIDATION_TOKEN = "MyCoupTest";

// Generate a page access token for your page from the App Dashboard
//const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
//  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
//  config.get('pageAccessToken');
const PAGE_ACCESS_TOKEN = 'EAACZBtupqxH8BAIJXovWRjkfWUNXdqfNq1ZCW4GJHexKwU9iNhq2vqZAXxARfE3Fg6QB5JZAl4Jyq4DgGUWSZAwb6ZB3fY4ypEGjoZCOJwvCkQyrHO1qxaZBiZAEiU5wW5uKAByM040GBevApRyRfPiGv8s3w5cZAk4vQNd8I4GQGYuQZDZD'; 

//
//  Standard FB messenger validation request where a challenge must be returned.
//
function validate( request ) {
    var challenge = null;
    if (request.query['hub.mode'] === 'subscribe' && request.query['hub.verify_token'] === VALIDATION_TOKEN) {
        challenge = req.query['hub.challenge'];
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
    }
    return challenge;
}

function processMessage( request, callback ) {
    console.log( "Processing face book message..." );
    console.log( request.body );
    var data = request.body;
    // Make sure this is a page subscription
    console.log( "procssing message" );
    console.log( JSON.stringify(data) );
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

           // Iterate over each messaging event
           pageEntry.messaging.forEach(function(messagingEvent) {
               sendTypingBubble(messagingEvent.sender.id);
               if (messagingEvent.optin) {
                   receivedAuthentication(messagingEvent);
               } else if (messagingEvent.message) {
                   console.log("Recieved messsage event...");
                   msg = new msgEvent.Msg(messagingEvent.sender.id);
                   msg.setSender(messagingEvent.recipient.id);
		   msg.setTimeStamp( messagingEvent.timestamp);
		   msg.setMsgRecieved( messagingEvent.message);
                   callback(msg);
               } else if (messagingEvent.delivery) {
                 //receivedDeliveryConfirmation(messagingEvent);
                 console.log( "Recieved delivery confirmation" );
               } else if (messagingEvent.postback) {
                 receivedPostback(messagingEvent);
               } else if (messagingEvent.read) {
                 receivedMessageRead(messagingEvent);
               } else if (messagingEvent.account_linking) {
                 receivedAccountLink(messagingEvent);
               } else {
                 console.log("Webhook received unknown messagingEvent: ", messagingEvent);
             }
           });
         });
    }
}

function getUserProfile( userID, callback ) {
    request( {
        uri: 'https://graph.facebook.com/v2.6/' + userID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender',
	qs: { access_token : PAGE_ACCESS_TOKEN },
	method: 'GET'
    }, function( err, response, body ) {
    // See what details from FB we can extract about the sender
        if ( err ) {
            console.log( "From getting name details: " + err );
            callback( null );
        } else {
            var data = JSON.parse(body);
            var userprofile = { firstname: data.first_name,
                                lastname: data.last_name,
                                profile_pic: data.profile_pic,
                                locale: data.locale,
                                timezone: data.timezone,
                                gender: data.gender }; 
	    console.log( "Response from  graph => " + data.first_name );
            callback( userprofile );
        }
    });
}

function sendTypingBubbleOff( recipientId ) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "TYPING_OFF"
  };

  callSendAPI(messageData);
}
function sendTypingBubble( recipientId ) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "TYPING_ON"
  };

  callSendAPI(messageData);
  sendTypingBubbleOff( recipientId );
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s", 
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });  
}

