//
//  facebook.js
//
//  configuraton checks and loading for facebook messaenger api
//
//

[ 'VALIDATION_TOKEN', 
  'PAGE_ACCESS_TOKEN' 
].forEach( function(name){
    if ( !process.env[name]) {
        throw new Error('Facebook configuration missing ' + name);
    }
});

const config = {
    validation_token : process.env.VALIDATION_TOKEN,
    page_access_token : process.env.PAGE_ACCESS_TOKEN
};

module.exports = config;
