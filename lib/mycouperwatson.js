//
//    mycouperwatson.js
//
//    Watson interface to conversation and discovery
//
//    Auth: solrak29@yahoo.com (carlos) (c) May 2017
//
var watson = require('watson-developer-cloud');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var parseJson = require('parse-json');

var discovery = new DiscoveryV1({
  username: '35fdacb8-484a-48bb-b3a6-c245be253ea3',
  password: 'KE8bPg1Pabzd',
  version_date: DiscoveryV1.VERSION_DATE_2016_12_15
});

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
    username: 'affd257a-84c2-4ea8-b4f3-715782634f07',
    password: '7rXgsx1itVBQ',
    path: { workspace_id: 'efca499d-7da2-49f4-9098-819f3a7c496c' },
    version_date: '2017-02-03'
});

const disc_environment_id ='82a39288-7b11-449d-bae1-7309b05d9663';
const disc_collection_id ='751e4206-6fb0-4ade-a63e-b5f9d2c9bf74';

var params = {
  cluster_id: 'scb448568d_0405_4bd6_be54_41623f8e63c3',
  collection_name: 'mycoopfaq',
  wt: 'json'
};



