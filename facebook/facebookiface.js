//
//    facebookiface.js
//
//    interface to facebook messenger api
//

var facebookconfig = require("../config/facebook.js");

function createFBInterface() {
    return new Facebook(); 
}

function Facebook( callback ) {
    this.callback = callback;
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


