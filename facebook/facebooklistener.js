//
//    facebooklistener.js
//
//    Interface that will listen for facebook request.
//

var facebook = require("facebookiface");

function Facebooklistener( callback ) {
    this.usercb = callback;
    this.facebook = new Facebook();
}

Facebooklistener.prototype.onReceipt = function ( msg ) {
    this.usercb(msg);    
}
