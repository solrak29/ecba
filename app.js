'use strict';

//
//   File: app.js
//
//   Entry point to launch the chat bot application
//
//   Author: solrak29@yahoo.com (carlos) (c) May 2017
//

var parseJson = require('parse-json');
var chatinterface = require("./lib/mycoupefbinterface.js");
var chatai = require("./lib/mycouperwatson.js");

var Users = require("./lib/mycoupeusers.js");
var users = new Users.Users();

var msgEvent = require( './lib/mycoupeMsgEvent.js' );
var MyCoopDocHand = require('./lib/mycoupedochandler.js' );
var docHand = new MyCoopDocHand.MyCoopDocHandler();
var util = require('util');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' });
var type = upload.single('file');


const 
  bodyParser = require('body-parser'),
//  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  request = require('request'),
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
console.log("Listening for events...");
app.listen( app.get('port'));

app.get('/', function(req, res ) {
    console.log("getting blank");
    res.sendStatus(403);          
});

//
//    Facebook messenger uses this function to register an app to messenger
//    The function called must return a challenge that will be sent back to service
//    Here we use this as an "restful" api for any messenger component if this is needed
//
app.get('/webhook', function(req, res) {
    console.log("Recieved FaceBook webhook request validation");
    var challenge = chatinterface.validate( req ); 
    if ( challenge ) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);          
    }
});

app.post('/', function( req, res ) {
    console.log("recieved a post event...");
    res.sendStatus(403);          
});

app.post('//fileupload',type,function(req,res,next) {

    console.log( "Uploading document...");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //console.log( "Request: " + util.inspect(req, false, null));
    var collection_name = req.body.collectionName
    if (collection_name == null) {
        err_message = 'No collection name'
        console.log(err_message)
        return res.status(400).json(err_message)
    }

    var description = req.body.description
    if (description == null) {
         description = ''
    }

    var property_manager = req.body.ownerName
    if (property_manager == null) {
         err_message = "No property manager provided"
         console.log(err_message)
         return res.status(400).json(err_message)
    }

    var propParams = {}
    propParams.propertyManager = property_manager
    propParams.type = req.body.type

    docHand.create_collection( collection_name, 
                      description, 
                      req.file.path,
                      propParams,
                      res,
                      function (err, data) {
        if (err) {
            console.log(err)
            return res.status(400).json(err);
        } else {
            console.log("Collection save...");
            return res.status(200).json("success");
            //
            //  TBD: save to db
        }
    });
});


app.post('//uploadaddress', type, function( req, res, next ) {
    console.log( "Uploading document...");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //console.log( "Request: " + JSON.stringify(req));
    //console.log( "Request: " + util.inspect(req, false, null));
    if ( req.mydata ) {
        console.log( req.mydata );
    }
    if ( req.file ) {
        console.log("Found file part...");
        var stat = docHand.uploaddoc( req.file );
    } else {
        // place holder for address upload
        console.log("No file but manual input");
    }
    return res.status(200).json("success");
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook call. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 *
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
    console.log("Recieving message via webhook...");
    // pass on to FB processing to extract the data and call the applications processEvent with object details 
    //console.log( "Request  => " + JSON.stringify(req.body) );
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

//
//  Main Event handler that will route to correct handling
//

function processEvent( eventDetails ) {
    console.log("app::processEvent");

    //
    //  Facebook messenger response
    //
    if ( typeof eventDetails !== 'undefined' && 
         eventDetails != null &&
         eventDetails.getEventSender() == "FB" ) {

             console.log("Recieved FaceBook Event..." );
             if ( eventDetails.getMessageText() ) {
                 var pageid = eventDetails.getRecipient();
                 var user = eventDetails.getSenderID();
                 console.log("Page ID " + pageid);
                 console.log("Sender ID (i.e. user) " + user );
                 // 
                 // Recieved a message from a user; check if has logged in before
                 // to determine if we need to go to FB to get any user details.
                 //
                 console.log("Checking is user already has chat dialog going...");
                 if ( !users.isKnownUser( user ) ) {
	             // start extracting details via chat interface since this a new dialog conversation
	             console.log("New dialog conversation getting user details from graph since we don't have info");
	             chatinterface.getUserProfile( user, function( userprofile){
	                 if ( userprofile ) {
                             console.log("Saving FB provided details from chat interface ");
		             users.addUser(userprofile.firstname, user, pageid );
		             console.log( "Saving user profile details for " + userprofile.firstname);
                             console.log("Senidng user details to ai");
                             chatai.send( users.getUserDetails(user), processEvent );
                             // sending user details to ai
		         } else {
		             console.log( "No user information found: chat ai will have to extract");
		             users.addUser( null, user, pageid);
		             console.log( "This function is TBD at the moment since the graph api will work");
		         }
	            }); // end getUserProfile
            } else {
                console.log("We have user set already sending direclty to ai");
                chatai.sendMsg( users.getUserDetails(user), eventDetails.getMsg(), processEvent );
            }
        } else {
            console.log("Did not recieve any message from event object");
            console.log("Should never get here need to investigate if we do");
        }

    } else {
        if ( typeof eventDetails !== 'undefined' && eventDetails != null ) {
            console.log( "Responding back to user" );
            chatinterface.sendTextMessage( eventDetails.getSenderID(), eventDetails.getMsg() ); 
        } else {
            console.log(" null event not sending any message");
        }
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
