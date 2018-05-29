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

var _msg = require("../message");

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
    console.log("Received message back about to send to source...");
    console.log("Message about to send " + msg.msgtext );
    if ( this._source ) {
        this._source.sendMsg(msg);
    } else {
        console.log("No source defined");
    }
}

ECBAController.prototype.sourcecallback = function( msg) {
    if ( this._destination ) {
        //
        // for now we deconstruct the message but we just want to receive plain message
        // this is facebook specific ... will fix later
        //
        var ecbamsg = _msg.createECBAMessage("MSG");   
        ecbamsg.setMsg(msg);
        ecbamsg.setUserId(msg.userid);
        this._destination.sendMsg(ecbamsg);
    } else {
        console.log("No destination defined");
    }
}

