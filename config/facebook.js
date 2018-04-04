//
//  facebook.js
//
//  configuraton checks and loading for facebook messaenger api
//
//

'use strict;'

//
//  environment configurations checks that are required
//

[
    'VALIDATION_TOKEN',
    'PAGE_ACCESS_TOKEN',
].forEach((name) => {
    if ( !process.env[name]) {
        throw new Error('Facebook configuration variables are missing ${name}'))
    }
})


