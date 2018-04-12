//
//    facebookiface.js
//
//    interface to facebook messenger api
//
//    author: carlos <solrak29@yahoo.com>

exports.createFBInterface = createFBInterface;
module.export = Facebook;
const util = require('util')
_fbmsg = require('./facebookmsg');

const 
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  express = require('express'),
  request = require('request'),
  path =require('path');

try {
    var facebookconfig = require("../config/facebook.js");
} catch(ex) {
    console.log(ex.message);
}

function createFBInterface(callback) {
    var fb = new Facebook(callback);
    return fb;
}

function Facebook(callback) {
    console.log("Initializing express on port (" + facebookconfig.fb_port +")");
    this.version = "1.0.0.0";
    this.clientcallback = callback;
    this.fbapp = express();
    this.fbapp.set('port', facebookconfig.fb_port);
    this.fbapp.set('view engine', 'ejs');
    this.fbapp.use(bodyParser.json());
    this.fbapp.get('/webhook', this.processWebHookValidation.bind(this));
    this.fbapp.post('/webhook',this.processMessage.bind(this));
    this.fbapp.listen(this.fbapp.get('port'));
}

Facebook.prototype.sendMessage = function( msg ) {
    console.log("Sending message...");
    if ( msg.constructor.name == "FacebookMsg" ) {
        var msgtofb = {
            message_type: "RESPONSE",
	    recipient: {
	        id: msg.userid
	    },
	    message: {
	        text: msg.msgtext,
		metadata: "DEVELPER_DEFINED_METADATA"
	    }
        };
	request({
	    uri:  'https://graph.facebook.com/v2.6/me/messages',
	    qs : { access_token: facebookconfig.page_access_token },
	    method: 'POST',
	    json: msgtofb
	    }, function (error, response, body) {
	        if ( !error && response.statusCode == 200 ) {
		    var recipientid = body.recipient_id;
		    var messageid = body.message_id;
		    if ( messageid ) {
                        console.log("Successfully sent message with id %s to recipient %s", messageid, recipientid);
		    } else {
                        console.log("Successfully called Send API for recipient %s", recipientid);
                    }
		} else {
                    console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
		}
	    });
    } else {
        throw new Error ("Not a facebookmsg type");
    }
}

Facebook.prototype.processMessage = function( req, res ) {
    console.log( "Checking client call back: " + typeof(this.clientcallback));
    if ( this.clientcallback ) {
        console.log("Processing message...");
        fbmsg = _fbmsg.createFBMessage(req.body);
        fbmsg.processMessage(req.body);
        console.log("Sending message (" + fbmsg.msgType +") to client...");
        this.clientcallback( this, fbmsg);
    } else {
        console.log("Here save the message until a call back has been registerd");
    }
    res.status(200).send('EVENT_RECEIVED');
}

Facebook.prototype.processWebHookValidation = function ( req, res ) {
    console.log("Facebook validation check...");
    var challenge = null;
    if ( req.query['hub.mode'] === 'subscribe' && 
         req.query['hub.verify_token'] ===  facebookconfig.validation_token ) {
         challenge = req.query['hub.challenge'];
    } else {
        res.sendStatus(403);          
        throw new Error("Facebook validation failed; incorrect validation token");
    }
    res.status(200).send(challenge);
}

Facebook.prototype.getUserProfile = function ( userID ) {
    request( {
        uri: 'https://graph.facebook.com/v2.6/' + userID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender',
	qs: { access_token : facebookconfig.page_access_token },
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

Facebook.prototype.sendTypingBubbleOff = function ( recipientId ) {
  var msgtofb = {
    recipient: {
      id: recipientId
    },
    sender_action: "TYPING_OFF"
  };
    request({
        uri:  'https://graph.facebook.com/v2.6/me/messages',
	qs : { access_token: facebookconfig.page_access_token },
	method: 'POST',
	json: msgtofb
	}, function (error, response, body) {
	    if ( !error && response.statusCode == 200 ) {
                 var recipientid = body.recipient_id;
		 var messageid = body.message_id;
		 if ( messageid ) {
                     console.log("Successfully sent message with id %s to recipient %s", messageid, recipientid);
		 } else {
                     console.log("Successfully called Send API for recipient %s", recipientid);
                 }
	    } else {
                console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
	    }
    });

}

Facebook.prototype.sendTypingBubble = function ( recipientId ) {
    var msgtofb = {
        recipient: {
          id: recipientId
        },
        sender_action: "TYPING_ON"
    };
    request({
        uri:  'https://graph.facebook.com/v2.6/me/messages',
	qs : { access_token: facebookconfig.page_access_token },
	method: 'POST',
	json: msgtofb
	}, function (error, response, body) {
	    if ( !error && response.statusCode == 200 ) {
                 var recipientid = body.recipient_id;
		 var messageid = body.message_id;
		 if ( messageid ) {
                     console.log("Successfully sent message with id %s to recipient %s", messageid, recipientid);
		 } else {
                     console.log("Successfully called Send API for recipient %s", recipientid);
                 }
	    } else {
                console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
	    }
    });
}


Facebook.prototype.version = function() {
    return this.version;
}
