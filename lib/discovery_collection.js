"use strict";

var EventEmitter = require('events')
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

// curl -X POST -u "7c630f51-1e34-4ae6-96a6-b45b22728a6f":"CIGJQdWzrAAM" -H "Content-Type: application/json" -d '{"name": "test_collection", "description": "My test collection", "configuration_id": "61892adb-08ab-45aa-bbff-1183c762b7c3"}' "https://gateway.watsonplatform.net/discovery/api/v1/environments/5b4a52cd-f328-49d2-9a20-953f42f2d65a/collections?version=2016-12-01"
// the documentation for watson mentions the name of the collection field as 'collection_name'
// however, the actual field name is just 'name'
// this change has to be brought about in discovery - v1.js file

class DCollection extends EventEmitter {
    constructor(credentials, collection_name, description) {
        super()
        this.discovery = new DiscoveryV1(credentials);
        this.collection_name = collection_name
        this.description = description
        this.environment_id = null
        this.configuration_id = null
    }

    create(collection_name, description) {
        this.collection_name = collection_name
        this.description = description
        this.emit('start')
    }
}

DCollection.prototype.getEnvironments = function () {
    const self = this
    this.discovery.getEnvironments({}, function (error, data) {
        if (error) {
            console.log("Environment error")
            self.emit('error', error)
        } else {
            const env = data.environments.filter((element)=>{return element.read_only == false})
            self.environment_id = env[env.length - 1].environment_id
            self.emit('environment_available')
        }
    })
}

DCollection.prototype.getConfigurations = function () {
    const self = this
    var params = {}
    params.environment_id = this.environment_id
    this.discovery.getConfigurations(params, function (error, data) {
        if (error) {
            console.log("Environment error")
            self.emit('error', error)
        } else {
            const configuration = data.configurations[0]
            self.configuration_id = configuration.configuration_id
            self.emit('configuration_available')
        }
    })
}

DCollection.prototype.createCollection = function (environment_id, collection_name, description, configuration_id) {
    const self = this
    var params = {}
    params = {
        "name":this.collection_name,
        "environment_id": this.environment_id,
        "description": this.description,
        "configuration_id": this.configuration_id
    }
    var retVal = {}
    retVal.environment_id = this.environment_id
    this.discovery.createCollection(params, function (error, data) {
        if (error) {
            console.log("Create Collection error")
            self.emit('error', error)
        } else {
            retVal.collection_id = data.collection_id
            self.emit('collection_created', retVal)
        }
    })
}

module.exports = DCollection
