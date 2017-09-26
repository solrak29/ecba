//
//    mycouperef.js
//
//    Provides public functions to get referential data for users and buildings
//
//    Auth: solrak29@yahoo.com (carlos) (c) Aug 2017
//
var parseJson = require('parse-json');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'mycoupe',
    password : 'mycoupe',
    database : 'mycoupe'
});

module.exports = {
    getUserByID : getUserByID,
    getUsers: getUsers,
    saveUser: saveUser,
    nonuser : nonuser,
    syserr : syserr
};

const nonuser = -1;
const syserr  = -2;

//
//  Save a user that has visited the page
//
function saveUser(id, name, from, callback) {
    var sql;
    if ( from == "FB" ) {
        sql = "insert into mycoop_users values ( first_name, facebook_id ) values ("+ name + "," + "id)";
    }
    connection.query(sql, function( err, result ) {
        if (err) {
           callback( "ERROR in saving user", null);
        } else {
	    console.log("Saved " + name );
	    callback("null", "saved");
	}
    });
}
//
//  Get all users that have used the system
//
function getUsers(callback) {
    var sql = "SELECT * from mycoop_users";
    connection.query(sql, function( err, rows, fields ) {
        if (err) {
           console.log("ERROR in getting all users : " + err);
           callback( "ERROR in getting all users", null);
        } else {
            if ( rows.length ) {
	        console.log( "Rows returned " + rows );
	        var parsedjson = parseJson(JSON.stringify(rows));
                console.log(" Retruned from db : " + parsedjson);
	        callback(null, rows); // parse the rows later
            } else {
                console.log("No rows returned");
	        callback(null, null); // parse the rows later
            }
        }
    });
}

//
//  Get's users information if the user exists in the databse.
//  If not returns a negative one of non-user constant
//
function getUserByID( userID, callback ) {
    var sql = "SELECT * from mycoop_users WHERE facebook_id = " + userID;
    connection.query( sql, function( err, rows, fields ) {
        if (err) {
	    console.log( "Querry : " + err );
	    callback( syserr, null );
        } else {
	    console.log( "Rows returned " + rows );
	    var parsedjson = parseJson(JSON.stringify(rows));
            console.log(" Retruned from db : " + parsedjson);
	    //callback(null, parsedjson);
	    callback(null, null); // parse the rows later
	}
    });
}
