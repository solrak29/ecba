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
    nonuser : nonuser,
    syserr : syserr
};

const nonuser = -1;
const syserr  = -2;
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
