//
//    index.js
//
//    Exports for facbook interface listenter.
//
//    author: carlos <solrak29@yahoo.com>

var facebooklistener = require("facebooklistener");
var facebookrequester = require("facebookrequester");
var facebookconfig = require("../config/facebook.js");

module.exports = {
    createlistener: facebookiface.listener
    createrequester: facebookiface.requester
}
