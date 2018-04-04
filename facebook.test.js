//
//  facebook.test.js
//
//  test code to test the interface to facedbook chat
//

facedbook = require('./facebook');

facebook.createlistener().add( function (fbmsg) {
   var sender = fbmsg.getSender();
   var receiver = fbmsg.getReceiver();
   var messagetype = fbmsg.getMsgType();
   var msg = fbmsg.getMsg(); 
   console.out(msg);
});

facbook.createrequester().sendMsg(msg);




