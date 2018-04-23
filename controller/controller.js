//
//    contorller.js
//
//    This class/module will handle what sources and destination that will be active to process
//    chat messages.  The basic context here is will always be from facebook->controller->watson.
//    However; we can always change facebook to be a webbased chat page, or device.  We can always
//    change watson to be anotehr person and/or SMS for example.

try{
    var controllerconfig = require("../config/controller.js");
} catch(ex) {
    console.log(ex.message);
}

exports.createECBAController = createECBAController;
module.export = ECBAController;

function createECBAController() {
    var controller = new ECBAController();
    return controller;
}

function ECBAController() {
    console.log("Creating ECVAController...");
    var me = this;
    this.version = "1.0.0.0";
    this.sourcelist = controllerconfig.source_destination.split(',');  
    this.destinationlist = controllerconfig.sink_destination.split(',');

    this.sourcelist.forEach(function(value) {
        if ( value == 'facebook' ) {
	        // trying to requires 
	        me._fb = require( "../"+value);
            me._fb.createFacebook( me.sourcecallback.bind(me) );
	    } else {
            console.log("Source is not allowed");
            throw new Error("Source is not setup yet: " +value);
        }
    });

    this.destinationlist.forEach(function(value) {
        if ( vlaue == 'console' ) {
            me._console = require("../"+value);
            var console = _console.createECBAConsoleBot();
            var console.startChat( me , me.sinkcallback.bind(me));
        } else {
            console.log("Destination is now allowed");
            throw new Error("Destination is not allowed " + value );
        }
    });
}

ECBAController.prototype.addSourceCallBack = function ( callback ) {
    this.callback = callback;
}

ECBAController.prototype.sourcecallback = function( fb, fbmsg) {
   if ( this.callback ) {
       this.callback(fb, fbmsg ); 
   } else {
       console.log( "there is no callback assigned yet");
   }
}

