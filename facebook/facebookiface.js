//
//    facebookiface.js
//
//    interface to facebook messenger api
//

try {
    var facebookconfig = require("../config/facebook.js");
} catch(ex) {
    console.log(ex.message);
}

function createFBInterface() {
    return new Facebook(); 
}

function Facebook( callback ) {
    this.callback = callback;
}

Facebook.prototype.processWebHookValidation = function ( req, res ) {
    var challenge = null;
    if ( req.query['hub.mode'] === 'subscribe' && 
         req.query['hub.verify_token'] ===  facebookconfig.validation_tokent ) {
         challenge = req.query['hub.challenge'];
    } else {
        throw new Error("Facebook validation failed; incorrect validation token");
    }
}

Facebook.prototype.createlistener = function ( callback ) {
    Facebook = new Facebook(callback);
}

Facebook.prototype.createrequester = function() {
    Facebook = new Facebook();
}

Facebook.prototype.onmessage = function ( msg ) {
    if ( this.callback ) {
        this.callback(msg);
    }
}

Facebook.prototype.sendMsg = function (msg) {
}


