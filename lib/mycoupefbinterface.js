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
exports.validate = validate;

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
//
//  Magic facebook page token
//const PAGE_ACCESS_TOKEN = 'EAACZBtupqxH8BAIJXovWRjkfWUNXdqfNq1ZCW4GJHexKwU9iNhq2vqZAXxARfE3Fg6QB5JZAl4Jyq4DgGUWSZAwb6ZB3fY4ypEGjoZCOJwvCkQyrHO1qxaZBiZAEiU5wW5uKAByM040GBevApRyRfPiGv8s3w5cZAk4vQNd8I4GQGYuQZDZD'; 

// Mykoop test page token 
const PAGE_ACCESS_TOKEN = "EAACZBtupqxH8BAAERZBlwlCZCwn1js5ZCkVpwlZAfXsKtH3Jnw0zwTddjNJUPF419DsZB4WApv20pIXxcZCqORUnmkutSNYk7NpQTXVfJiaS4EfvN8KqiRtAddUR9HK0XYZAABrq95w0ZB2wRVkqaVoNnXqpj4fKRFcDH4w1WpuyZC5gZDZD"
//
//  Standard FB messenger validation request where a challenge must be returned.
//
function validate( request ) {
    var challenge = null;
    if (request.query['hub.mode'] === 'subscribe' && request.query['hub.verify_token'] === VALIDATION_TOKEN) {
        challenge = request.query['hub.challenge'];
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
    }
    return challenge;
}

function receivedMessageRead(event) {
    var senderID = event.sender.id;
    var recipeintID = event.recipient.id;
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;
    console.log("Received read notification with water mark and sequence");
}

function processMessage( request, callback ) {
    console.log( "mycoupefbinterface::processMessage");
    var data = request.body;
    // Make sure this is a page subscription
    console.log( JSON.stringify(data) );
    if (data.object == 'page') {
        console.log("Recieved facebook page message");
        //
        // Iterate over each entry : should only be one entry for the page
        // There may be multiple if batched from fb?
        //
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            //
            // Iterate over each messaging event : should only be one
            pageEntry.messaging.forEach(function(messagingEvent) {
               var userid = messagingEvent.sender.id;
               var pageid = messagingEvent.recipient.id;
               // Place holder where we want to send the user to the call back
               // The call back should save the history of when the user last interacted with system.
               // The id should also look up the user.
               if (messagingEvent.optin) {
                   //receivedAuthentication(messagingEvent);
                   console.log("Not processing optin event");
               } else if (messagingEvent.message) {
                   if ( messagingEvent.message.is_echo != 'true' ) {
                       console.log("Recieved messsage event...");
                       sendTypingBubble(userid);
                       msg = new msgEvent.Msg(userid);
                       msg.setEventSender( "FB" );
                       msg.setRecipient(pageid);
		       msg.setTimeStamp( messagingEvent.timestamp);
		       msg.setMsgRecieved( messagingEvent.message.text);
                       callback(msg);
                   } else {
                       console.log("Received echo event skipping");
                       callback(null);
                   }
               } else if (messagingEvent.delivery) {
                 //receivedDeliveryConfirmation(messagingEvent);
                 console.log( "Recieved delivery confirmation" );
                 sendTypingBubbleOff( messagingEvent.sender.id);
               } else if (messagingEvent.postback) {
                 //receivedPostback(messagingEvent);
                 console.log( "Recieved postback event skipping");
               } else if (messagingEvent.read) {
                 sendTypingBubbleOff( messagingEvent.sender.id);
                 //receivedMessageRead(messagingEvent);
                 console.log("Recieved message read event");
               } else if (messagingEvent.account_linking) {
                 //receivedAccountLink(messagingEvent);
                 console.log("Recieved account link event");
               } else {
                 console.log("Webhook received unknown messagingEvent: ", messagingEvent);
             }
           });
         });
    } else {
        console.log( "Uknown web hook object: should be page");
    }
    callback(null);
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
  //sendTypingBubbleOff( recipientId );
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  console.log( "Sending msg back for recipeintId: " + recipientId);
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

