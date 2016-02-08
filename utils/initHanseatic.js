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
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'useradd',
            '-c',
            'p1',
            'p1@nomail.com',
            'p1']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'useradd',
            '-c',
            'p2',
            'p2@nomail.com',
            'p2']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'organizationadd',
            'startingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'organizationadd',
            'ongoingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'organizationadd',
            'archiveGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'guest',
            'archiveGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'guest',
            'ongoingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'guest',
            'startingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'p1',
            'archiveGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'p1',
            'ongoingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'p1',
            'startingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'p2',
            'archiveGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'p2',
            'ongoingGames']);
    })
    .then(function(){
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            'p2',
            'startingGames']);
    })
    .then(function () {
        console.log('everything is fine')
    })
    .catch(function (err) {
        console.log('something went wrong:',err);
    });

