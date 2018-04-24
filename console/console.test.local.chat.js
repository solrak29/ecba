//
//  console.test.js
//
//  test code to test the console componenet
//
//  carlos <solrak29@yahoo.com>

var testmsg = "[ECBACONSOLE_TEST_2018]";
console.log( testmsg + " Testing Console Component...");
_console = require("../console");

console.log( "Creeating chat interface to talk to Chat Bot simulator...");
console_chat = _console.createECBAConsoleChat();

console.log( "Creeating Bot interface to talk to Chat simulator...");
console_bot = _console.createECBAConsoleBot();

//
//  When startChat is called here is where we have entered our callback.
//
//

function messageFromBot( err, msg ) {
    console.log("Received message from bot stdin");
    console_chat.sendMsg(msg.msg);
}

function errorMsgFromBot(msg) {
}

function messageFromChatInput(err, result) {
    console.log("Received from chat stdin " + result.msg);
    console.log("Sending to bot...");
    console_bot.sendMsg(result.msg);
}

function errorMsgFromChat(msg) {
}

console_bot.startChat(messageFromBot, errorMsgFromBot );
console_chat.startChat(messageFromChatInput, errorMsgFromChat );
