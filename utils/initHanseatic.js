/**
 * @author kecso / https://github.com/kecso
 */

//we add siteAdmin priviliges to the guest user, which is not the best, but that is what we have so far
var usermanager = require('webgme/src/bin/usermanager');

usermanager.main([
    'node',
    './node_modules/src/bin/usermanager.js',
    'useradd',
    '-c',
    '-s',
    'guest',
    'guest@nomail.com',
    'guest'])
    .then(function () {
        console.log('everything is fine')
    })
    .catch(function (err) {
        console.log('something went wrong:',err);
    });

