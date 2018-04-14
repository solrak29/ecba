//
//  controller.test.js
//
//  test code to test the controller componenet
//
//  carlos <solrak29@yahoo.com>

var testmsg = "[ECBACONTROL_TEST_2018]";
console.log( testmsg + " Testing Controller Component...");
_ctrl = require("../controller");
ctrl = _ctrl.createECBAController();
console.log( testmsg + " Using version " + ctrl.version);
console.log( testmsg + " Source " + ctrl.sourcelist);
console.log( testmsg + " _fb " + ctrl._fb);

function callback( fb, msg ) {
    if ( msg.msgType == "MSG" ) {
        console.log ( testmsg + " received msg from facbook" );
        msg.setText( testmsg + "I received your message (" + msg.msgtext + ")");
        fb.sendMessage(msg);
    }

}

ctrl.sourcecallback( callback );
