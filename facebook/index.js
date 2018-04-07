//
//    index.js
//
//    Exports for facbook interface
//
//    author: carlos <solrak29@yahoo.com>
//

var facebookiface = require("./facebookiface.js");
var facebookmsg = require("./facebookmsg.js");

module.exports = {
    createFacebook: facebookiface.createFBInterface,
    createFacebookMsg: facebookmsg.createFBMessage
}
