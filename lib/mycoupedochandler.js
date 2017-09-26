//
//    mycoupedochandler.js
//
//    This will handle all documents from the web site.
//    Addresses are uploaded via csv or excell file.
//    building documents will be uploaded to watson
//
//    Auth: solrak29@yahoo.com (carlos) (c) June 2017
//
//

var express = require('express')
var app = express()
var DocumentConversionV1 = require('watson-developer-cloud/document-conversion/v1')
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var bodyParser = require('body-parser')
const spawn = require('child_process').spawn
var DCollection = require('./discovery_collection.js')
var batch = require('batchflow')
var crypto = require('crypto')
var mysql = require('mysql')
var request = require('request')
var parseJson = require('parse-json');

exports.MyCoopDocHandler = MyCoopDocHandler;

//{
//  "url": "https://gateway.watsonplatform.net/discovery/api",
//  "username": "fe67a5ff-5bbf-4d14-9442-9067dcc1e8b9",
//  "password": "WCE1QZluc2Vg"
//}
//    username: '35fdacb8-484a-48bb-b3a6-c245be253ea3',
//    password: 'KE8bPg1Pabzd',

// Private variables shared amongst all instances
// TBD: get these items from the database using a hashed application key for auth
//      for now we hard code.
var collection_id = "5761f8d4-ecb3-49d6-9c88-417037f529bd";
var configuration_id = "c3ceba92-a006-4e7e-9bf5-38cb0ef3a7fd";
var environment_id = "0e8550de-d5f8-42ba-9908-7ef0d7b09ccf";
var discoveryCred1 = {
    username : "fe67a5ff-5bbf-4d14-9442-9067dcc1e8b9",
    password: "WCE1QZluc2Vg",
    version: 'v1',
    version_date: '2016-12-01'
}

var docConvCred1 = {
    username: '4a284fe7-43d3-464d-a2ef-347aaa204ed5',
    password: 'hjL0S6wQFBU5',
    version_date: '2015-12-01'
}

var mysqlCred = {
    host: 'localhost',
    user: 'mycoupe',
    password: 'mycoupe',
    database: 'mycoupe'
}

function MyCoopDocHandler() {
    
    this.connection = mysql.createConnection( mysqlCred );
    this.discoveryCred = discoveryCred1
    this.docConvCred = docConvCred1
    this.discovery = new DiscoveryV1(this.discoveryCred);
    this.document_conversion = new DocumentConversionV1(this.docConvCred);
}

MyCoopDocHandler.prototype.uploaddoc = function ( file ) {
    console.log( "Uploading file " + file);
    out = fs.openSync('./out.log', 'w'), err = fs.openSync('./out.log', 'w');
    originalFileName = null
    originalFileName = file.originalname;
    filePath = file.path;

    //spawn child process and detach
    child_process = spawn('node', ['/home/mycoupe/lib/address_parser.js', filePath, null], {
            stdio: ['ignore', out, err],
            detached: true
    });
}

MyCoopDocHandler.prototype.getCollection = function( collection_name , callback) {
    var found_collection = false;
    var collectionReturned = "";
    var param = { environment_id : environment_id };
    this.discovery.getCollections( param, function( err, data ) {
        if ( err ) {
            console.log( "Error in getting collection: " + err );
        } else {
            var collectionlist = JSON.stringify(data, null, 2 );
            console.log( collectionlist );
            var numCollections = data.collections.length;
            console.log("Found " + numCollections + " collections");
            for( var i = 0; i < numCollections; i++ ) {
               console.log(" Checking for existing collection name: " + data.collections[i].name );
               if ( data.collections[i].name == collection_name ) {
                    found_collection = true;
                    console.log("Found collection");
                    collectionReturned = data.collections[i];
               }
            } 
            callback(found_collection, collectionReturned);
        }
    });
}


MyCoopDocHandler.prototype.convertDocument = function( filePath, 
                                                       propParams, 
						       collParams, 
						       res, 
						       callback) {

var that = this;
// (JSON) ANSWER_UNITS, NORMALIZED_HTML, or NORMALIZED_TEXT
this.document_conversion.convert({ file: fs.createReadStream(filePath),
                                   conversion_target: this.document_conversion.conversion_target.ANSWER_UNITS,
                                   // Add custom configuration properties or omit for defaults
                                  }, 
				  function (err, response) {
                                      if (err) {
                                          console.error(err);
                                          callback(err, null); // let the callback know there was a problem
                                  } else {
                                       var output_json = JSON.parse(JSON.stringify(response, null, 2))
                                       var answer_units = output_json.answer_units
                                       const salt = Math.floor(new Date() / 1000).toString()
                                       var tempDir = 'uploads/' + crypto.createHash('md5').update(salt).digest("hex") + '/'
                                       console.log("Creating directory: " + tempDir);
                                       fs.mkdir(tempDir)
                                       batch(answer_units).sequential().each((i, item, done) => {
                                           console.log('perform upload operation')
                                           if (item.content[0].text != "") {
                                               var output = {};
                                               output['property_owner'] = 'testmanager';
                                               output['type'] = 'testtype';
                                               output['question'] = item.title;
                                               output['answer'] = item.content[0].text;
                                               const fileName = "upload" + i + '.json'
                                               const tempFilePath = tempDir + fileName
                                               fs.writeFileSync(tempFilePath, JSON.stringify(output), 'utf8');
                                               var file = fs.createReadStream(tempFilePath);
                                               console.log("Adding document " + tempFilePath);

                                               that.discovery.addDocument({ environment_id: environment_id,
                                                                            collection_id: collection_id,
                                                                            metadata: '{"Content-Type":"application/json"}',
                                                                            file: file
                                                                          }, function (error, data) {
                                                                              if (error) {
                                                                                  console.log("add document err" + error);
                                                                                  //save file for later
                                                                                  fs.rename(tempFilePath, '/' + fileName, (err) => {
                                                                                      if (err) { console.log('error moving file - ' + tempFilePath) }
                                                                                  });
                                                                              } else {
                                                                                 console.log("No error in upload");
                                                                                 console.log(JSON.stringify(data));
                                                                                 //remove temp file
                                                                                  fs.unlink(tempFilePath)
                                                                              }
                                                                              done()
                                                                           });
                                               } else {
                                                   done()
                                               }
                                 }).end((result) => {
                                     callback(null, "Data uploaded");
                                     console.log('delete temp dir')
                                     fs.rmdir(tempDir, (err) => {
                                         if (err) {
                                             console.log(err)
                                         } else {
                                             console.log('removed temp dir successfully')
                                        }
                                     });
                                 });
                        }
        });
}

MyCoopDocHandler.prototype.create_collection = function( collection_name, 
                                                          description, 
                                                          filePath, 
                                                          propParams, 
                                                          res, 
                                                          callback) {
    var that = this;
    
    that.getCollection(collection_name, function(collection_exists, data) {

        if ( !collection_exists ) {
            var param = { environment_id : environment_id,
                          name : collection_name,
                          description : description,
                          configuration_id : configuration_id };

            console.log( "Adding collection: collection name : " + param.collection_name);
            console.log( "Adding collection: description : " + param.description);
            console.log( "Adding collection: filepath : " + filePath);

            that.discovery.createCollection( param , function(error, data) {
                if ( error ) {
                    console.log("Collection not created Error: " + error);
                } else {
                    // you will get a collection id and and configuration that you must use to upload documentation
                    // for now we update the global variable for testing
                    console.log("Created the collection");
                    console.log(JSON.stringify( data, null, 2));
                    collection_id = data.collection_id;
                    configuration_id = data.configuration_id;
                    that.convertDocument(filePath, propParams, data, res, callback);
                }
            });
        } else {
            console.log("Collection already exists gathering existing collection to add");
            // if the collection exists we may be inserting duplicate data; we need
            // to check this and potentially not enter duplicate data.
            that.convertDocument(filePath, propParams, data, res, callback);
        }
    });
}



app.use(bodyParser.json());

var type = upload.single('file');
var originalFileName;
var filePath;
var child_process = null;

app.get('/', function (req, res ) {
   console.log("won testing"); 
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


    //} else if (req.body.address) {
    //    var item = req.body.address
    //    get_formatted_address(item, function (err, addresses) {
    //        if (err) {
    //            //do nothing
    //            console.log("Address error: " + err)
    //        } else {
    //            // console.log(addresses)
    //            if (addresses.length > 0) {
    //                var address = addresses[0]
    //                //save address_line, formatted address, GPS coordinates in the database
    //                const query = 'INSERT INTO `mycoop_address` (`apartment_name`, `address_normalized`, `apartment_latitude`, `apartment_longitude`) VALUES (\"' + item + '\",\"' + address.formatted_address + '\",' + address.geometry.location.lat + ',' + address.geometry.location.lng + ');'
     //               executeQuery(query, (err, data) => {
     //                   if (err) {
     //                       console.log(err)
     //                   } else {
     //                       console.log('Address inserted successfully - ' + item)
     //                   }
     //               })
     //           }
     //       }
     //   })
     //   setTimeout(function () {
     //   }, 1000);
    //} else {
    //    console.log("error");
    //    return res.status(400).json("error");
   // }
//}


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

app.post('//updateBuildingData', type, function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    console.log(req.file);

    if (req.file) {
        var address = req.body.address
        var err_message = '';
        if (address == null) {
            err_message = 'No address selected'
            console.log(err_message)
            return res.status(400).json(err_message)
        }

        //get collection id and environment id for this address
        var collection_id = null
        var environment_id = null
        executeQuery('', (err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            } else {
                //do something with the row data
                collection_id = 'abcde'
                environment_id = 'fghij'

                //fire the document conversion and upload process
            }
        })

        //return res.status(200).json("success");
    }
})
