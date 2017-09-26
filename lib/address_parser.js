var express = require('express')
var app = express()
var csv = require('fast-csv')
var fs = require('fs');
var mysql = require('mysql');
var parseJson = require('parse-json');
var request = require('request')
var batch = require('batchflow')

var myArgs = process.argv;
console.log('myArgs: ', myArgs);

var filePath = myArgs[myArgs.length - 2]
var address = myArgs[myArgs.length - 1]

if (filePath == null || filePath == '') {
    if(address == null || address == '') {
        return
    }
}

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'mycoupe',
    password: 'mycoupe',
    database: 'mycoupe'
});

function get_formatted_address(address_text, callback) {
    request({
        uri: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address_text
    }, function (error, response, body) {
        var parsedJSON = parseJson(body);
        if (parsedJSON.status != 'ZERO_RESULTS' && parsedJSON.results != '') {
            var addresses = parsedJSON.results
            var filtered_addresses = addresses.filter((elem) => {
                var flag = false
                elem.types.forEach((e) => {
                    flag |= (e == 'premise' || e == 'street_address' || e == 'establishment')
                })
                return flag
            })
            callback(null, filtered_addresses)
        } else {
            // When API results with zero rows
            callback('no addresses found - ' + parsedJSON.toString(), null)
        }
    });
}

function executeQuery(query, callback) {
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err, null)
        } else {
            // var parsedJSON = parseJson(JSON.stringify(rows));
            // callback(null, parsedJSON);
            callback(null, rows)
        }
    })
}

var status = 'done'

function processAddress(item, done) {
    get_formatted_address(item, function (err, addresses) {
        if (err) {
            //do nothing
            console.log("Address error: " + err)
        } else {
            // console.log(addresses)
            if (addresses.length > 0) {
                var address = addresses[0]
                //save address_line, formatted address, GPS coordinates in the database
                const query = 'INSERT INTO `mycoop_address` (`apartment_name`, `address_normalized`, `apartment_latitude`, `apartment_longitude`) VALUES (\"' + item + '\",\"' + address.formatted_address + '\",' + address.geometry.location.lat + ',' + address.geometry.location.lng + ');'
                executeQuery(query, (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Address inserted successfully - ' + item)
                    }
                })
            }
        }
        if(done) {
            done()
        }
    })
}

//parse csv file and get address
if (filePath != null) {
    var stream = fs.createReadStream(filePath)
    var address_list = []
    var csvStream = csv()
        .on("data", function (data) {
            status = 'processing'
            var address_line = data.join()
            address_list.push(address_line)
        })
        .on("end", function () {
            status = 'done'
            console.log("done");
            batch(address_list).sequential().each((i, item, done) => {
                processAddress(item, done)
            }).end((result) => {

            })
        });
    stream.pipe(csvStream);
} else if (address != null) {
    processAddress(address, null)
}

app.get('/status', function (req, res) {
    res.send(status)
})

app.listen(3003, function () {
    console.log('Example app listening on port 3003!')
})
