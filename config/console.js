//
//  console.js 
//
//  configuraton checks and loading for console configuration
//
//

[ 'CONSOLE_REMOTE', 
  'CONSOLE_REMOTE_PORT'
].forEach( function(name){
    if ( !process.env[name]) {
        if ( name == "CONSOLE_REMOTE" ) {
            process.env["CONSOLE_REMOTE"] = "False";
        } else if ( name == "CONSOLE_REMOTE_PORT" ) {
            if ( process.env['CONSOLE_REMOTE'] && process.env['CONSOLE_REMOTE'] == 'True' ) {
                throw new Error( "Console Bot missing configuration for Remote functionality");
            }
        } else {
            throw new Error('Facebook configuration missing ' + name);
        }
    }
});

const config = {
    console_remote: process.env.CONSOLE_REMOTE,
    console_port:   process.env.CONSOLE_PORT
};

module.exports = config;
