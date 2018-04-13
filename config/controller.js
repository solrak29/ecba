//
//  controller.js 
//
//  configuraton checks and loading for controller configuration
//
//

[ 'SOURCE_GEN', 
  'DESTINATION_GEN'
].forEach( function(name){
    if ( !process.env[name]) {
        throw new Error('Facebook configuration missing ' + name);
    }
});

const config = {
    source_destination: process.env.SOURCE_GEN,
    sink_destination: process.env.DESTINATION_GEN
};

module.exports = config;
