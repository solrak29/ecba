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
console.log( testmsg + "_fb2" + ctrl._fb2);
