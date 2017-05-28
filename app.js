'use strict';

//
//   File: app.js
//
//   Entry point to launch the chat bot application
//
//   Author: solrak29@yahoo.com (carlos) (c) May 2017
//

var parseJson = require('parse-json');
var mycoupeRef = require("./lib/mycouperef.js");
var chatinterface = require("./lib/mycoupefbinterface.js");
//var users = require("./lib/mycoupeusers.js");

const 
  bodyParser = require('body-parser'),
//  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  request = require('request'),
  util = require('util'),
  path =require('path');


//
// main
//
var app = express();
app.set('port', 5000);
app.set('view engine', 'ejs');
//app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.json());
//app.use(express.static('public'));
app.listen( app.get('port'));

//
//    Facebook messenger uses this function to register an app to messenger
//    The function called must return a challenge that will be sent back to service
//    Here we use this as an "restful" api for any messenger component if this is needed
//
app.get('/webhook', function(req, res) {
    console.log("Recieved webhook request validation");
    challenge = chatinterface.validate( req, handleValidation); 
    if ( challenge ) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);          
    }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
    console.log("Recieving message...");
    // pass on to FB processing to extract the data and call the applications processEvent with object details 
    console.log( "Request  => " + JSON.stringify(req.body) );
    chatinterface.processMessage( req, processEvent );
    //console.log( "Data => " + JSON.stringify(data));
    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've 
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
});

//
//  Call back function that takes either and error or the user's actual name
//  If user's profile is populated then the user has used this service before
//
function userMessage( err, userprofile){
    if ( username ) {
    } else {
        // see if we can start extracting the user details from chat info
    }
}


function processEvent( eventDetails ) {

    if ( eventDetails.getMessageText() ) {
        console.log('==================AM HERE '+ eventDetails.getSender()+' ===========================');
        // 
        // Recieved a message from a user; check if user is known
        //
	var knownUser = false;
	var messageText = null;
	var userprofile = {};

        //
	// tbd, database return needs to return the same details as getUserProfile from chatinterface
        // tbd:  this sequence will go to discover via the chatinterface
	//
	//
        mycoupeRef.getUserByID( eventDetails.getSenderID(), function( err, userprofile){
            if ( userprofile ) {
	        knownUser = true;
                consloe.log( "Db Returned user details...");
	        messageText = "Welcome back " + userprofile.first_name + " to MyCoop. Your personal virtual agent.  How may of be of service?";
            } else {
	        // start extracting details via chat interface
		chatinterface.getUserProfile( eventDetails.getSenderID(), function( userprofile){
		    if ( userprofile ) {
                        console.log(" got user details from chat interface ");
		        messageText = "Welcome to MyCoop, " + userprofile.firstname + "!  It seems you are new here.  I am your virtual building manager, dedicatd to helping your residential building needs.";
			console.log( "Saviing user profile details for " + userprofile.firstname);
                        // tbd: need to save user profile details
			//mycoupeRef.saveUserProfile( userprofile );
	                chatinterface.sendTextMessage( eventDetails.getSenderID(), messageText );
		    } else {
		        messageText = "Welcome to MyCoop!  It seems you are new here.  I am your virtual building manager, dedicated to helping your residential building needs.";
	                chatinterface.sendTextMessage( eventDetails.getSenderID(), messageText );
		    }
		});
	    }
        }); 

    } else {
        consle.log(" Recieved a non-message text event tbh ");
    }
}


var requestText = '';
var senderID = '';
var myContext ={};
var senderfbID = '';
var recep_fbid = '';
var requestText = '';

var http = require('http').Server(app);
const io = require('socket.io')(http,{path: '//socket.io'});

var global_request_txt = '';

function parseText(responseData){
  console.log("checking key in parseText " + responseData.key);
  if(responseData.key=='user_name'){
    console.log("Checking db" + responseData.value);
    return_fb_username(senderID, responseData.value); 
  }else{
      console.log("Sending text message " + responseData.value);
      sendTextMessage(senderID, responseData.value);  
  }
}


app.get("/", function(request, res) {
    console.log("Recieved");
    res.status(200).send("hello");
});

app.get("//index", function(request, res) {
       console.log("chatb page loaded from rar to chat");
       res.sendFile(path.join(__dirname, "./chat.html"));
    });

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL. 
 * 
 */
app.get('/authorize', function(req, res) {
  var accountLinkingToken = req.query.account_linking_token;
  var redirectURI = req.query.redirect_uri;
  // Authorization Code should be generated per user by the developer. This will 
  // be passed to the Account Linking callback.
  var authCode = "1234567890";

  // Redirect users to this URI on successful login
  var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  });
});

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid 
// certificate authority.
//http.listen( 3000, function(error, result) {
//console.log("error" + error);
//  console.log('Node app is running on port 3000');
//});
io.on('connection', function(socket){
console.log('io connection for chat from io enabled');
  socket.on('chat_message', function(msg){
console.log('io connection for chat from io enabled2');
    if(msg == 'supervisor_disconnect_chat' || msg == 'bye'){
//      memcache.put(support_enable[senderID], 0);
  sendTextMessage(senderID, 'Thank you for contacting supervisor, we hope your query got resolved. Is there anything that i can help you further?');
support_enable[senderID]=0;
      return false;
    }
    sendTextMessage(senderID, msg);
  });
});
module.exports = app;
