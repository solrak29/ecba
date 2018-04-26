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
        console.log("Processing source list " + value);
        if ( value == 'facebook' ) {
	        // trying to requires 
	        me._fb = require( "../"+value);
            me._source = me._fb.createFacebook( me.sourcecallback.bind(me) );
	    } else if ( value == 'console' ) {
            me._console = require("../"+value);
            me._source =  me._console.createECBAConsoleChat();
        }else {
            console.log("Source is not allowed");
            throw new Error("Source is not setup yet: " +value);
        }
    });

    this.destinationlist.forEach(function(value) {
        if ( value == 'console' ) {
            me._console = require("../"+value);
            me._destination = me._console.createECBAConsoleBot();
            me._destination.startChat( me.sinkcallback.bind(me), me.sinkerrcallback.bind(me));
        } else {
            console.log("Destination is now allowed");
            throw new Error("Destination is not allowed " + value );
        }
    });
}

ECBAController.prototype.sinkerrcallback = function(err, result ) {
    console.log("Error received from source");
}

ECBAController.prototype.sinkcallback = function(err, msg) {
    if ( this._source ) {
        this._source.sendMsg(msg);
    } else {
        console.log("No source defined");
    }
}

ECBAController.prototype.sourcecallback = function( fb, fbmsg) {
    if ( this._destination ) {
        //
        // for now we deconstruct the message be we just want to receive plain message
        // this is facebook specific
        //
        this._destination.sendMsg(fbmsg.msgtext);
    } else {
        console.log("No destination defined");
    }
}

