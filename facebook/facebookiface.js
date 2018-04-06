//
//    facebookiface.js
//
//    interface to facebook messenger api
//
//    author: carlos <solrak29@yahoo.com>

exports.createFBInterface = createFBInterface;
module.export = Facebook;
const util = require('util')

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

Facebook.prototype.processMessage = function( req, res ) {
    console.log( this.value + "Checking client call back: " + typeof(this.clientcallback));
    if ( this.clientcallback ) {
        console.log("Call the call back with a fb message type to be parse");
        this.clientcallback( this,"test");
    } else {
        console.log("Here save the message until a call back has been registerd");
    }
    res.sendStatus(200);
}

Facebook.prototype.processWebHookValidation = function ( req, res ) {
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

Facebook.prototype.version = function() {
    return this.version;
}
