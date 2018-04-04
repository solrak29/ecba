//
//    facebookiface.js
//
//    interface to facebook messenger api
//

var function facebooklistener( callback ) {
    Facebook = new Facebook(callback);
}

var function facebookrequester( ) {
    Facebook = new Facebook();
}
function Facebook( callback ) {
    this.callback = callback;
}

Facebook.prototype.onMessage( msg ) {
    if ( this.callback ) {
        this.callback(msg);
    }
}

Facebook.prototype.sendMsg(msg) {
}


