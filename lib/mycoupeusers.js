//
//    mycoupeusers.js
//
//    This is object that will track users interacting with the bot.
//
//    Auth: solrak29@yahoo.com (carlos) (c) June 2017

var mycoupeRef = require("./mycouperef.js");

exports.Users = Users;

//  The data structure at which users to be held in memory
//var usersprofile = {
//    lastvisted: ,
//    registerd: ,
//
//}; // initialize an empty map.
//
//
var modulename = "mycoupeusers";
function Users () {
    console.log(modulename+":constructor");
    // Access db and get all the user's that have ever visited
    // This may not be practical later if the user base grows
    this.getAllUsers();
    if ( "undefined" === typeof this.userprofiles ) {
        this.userprofiles = {};
    }
}

Users.prototype.getAllUsers = function getAllUsers() {
    console.log(modulename+":getallusers");
    mycoupeRef.getUsers(function( err, data ) {
        if ( data != null ) {
            console.log(data); 
            this.userprofiles = {};
            data.forEach( function( userdata ) {
                console.log( "Processing " + userdata );
                username = userdata.first_name;
                userID = userdata.facebook_id;
                recID = userdata.id;
                console.log( "Adding User: " + username + " with User ID: " + userID);
                this.userprofiles[userID] = { username: username,
                                              userID: userID,
                                              recID: recID}; 
            });

        } else { 
            console.log("No data returned for users");
        }
    });
}


Users.prototype.isKnownUser = function( userID ) {
    console.log("mycoupeusers::isKnonwUser");
    var knownUser = false;
    if ( "undefined" === userID ) {
         console.log("argument userID is undefined");
    } else if ( "undefined" === typeof this.userprofiles) {
        console.log("no users setup yet");
    } else {
        if ( this.userprofiles[userID] ) {
            console.log("Found user");
        }
        if ( "undefined" != typeof this.userprofiles[userID] ) {
            console.log("Known user");
            knownUser = true;
        } else {
            console.log("User ID " + userID + " not in memory");
            console.log( "User profile dump: " + typeof this.userprofiles);
            Object.keys(this.userprofiles).forEach( function (key) {
                console.log( "Key => " + key );
            });
        } 
    }
    return knownUser;
}

//
//  This function will check if user is in the list of user's currently interacting.
//  if the user exists in our map then return false as we already know they are 
//  here.
//
function isLiveUser( userID ) {
    if ( this.usersprofile[userID] ) {
        return true;
    } else {
        return false;
    }
}

Users.prototype.addUser = function ( userName, userID, recID ) {
    console.log("mycoupeusers::adduser");
    this.userprofiles[userID] = { username: userName,
                                  userID: userID,
                                  recID: recID}; 
    console.log("mycoupeusers::adduser - Saved user profile; attempting db save");
    mycoupeRef.saveUser(userID, userName, "FB", function( err, result ) {
        if ( err ) {
            console.log("Unable to save user: Error(" + err + ")");
        } else {
            console.log("user saved...");
        }
    });
}

// 
// Returns the user detilas object.
// Later we will have access via an object functions
//
Users.prototype.getUserDetails = function ( userID ) {
    console.log("mycoupeusers::getUserDetails");
    return this.userprofiles[userID];
}
