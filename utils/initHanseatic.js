/**
 * @author kecso / https://github.com/kecso
 */

//we add siteAdmin priviliges to the guest user, which is not the best, but that is what we have so far
var usermanager = require('webgme/src/bin/usermanager'),
    importer = require('webgme/src/bin/import');

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
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'organizationadd',
            'creator']);
    })
    .then(function () {
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'organizationadd',
            'player']);
    })
    .then(function () {
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'organizationadd',
            'archiver']);
    })
    .then(function () {
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            '-m',
            'guest',
            'creator']);
    })
    .then(function () {
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            '-m',
            'guest',
            'player']);
    })
    .then(function () {
        return usermanager.main([
            'node',
            './node_modules/src/bin/usermanager.js',
            'usermod_organization_add',
            '-m',
            'guest',
            'archiver']);
    })
    .then(function () {
        return importer.main(['node', './node_modules/src/bin/import.js',
            './utils/Oware.json',
            '-p', ‘Oware’,
            '-b', 'master',
            '-o', 'creator'
        ]);
    })
    .then(function () {
        return importer.main(['node', './node_modules/src/bin/import.js',
            './utils/pegSolitare.json',
            '-p', 'pegSolitare',
            '-b', 'master',
            '-o', 'creator'
        ]);
    })
    .then(function () {
        return importer.main(['node', './node_modules/src/bin/import.js',
            './utils/TicTacToe.json',
            '-p', 'TicTacToe',
            '-b', 'master',
            '-o', 'creator'
        ]);
    })
    .then(function () {
        return importer.main(['node', './node_modules/src/bin/import.js',
            './utils/ThreeMensMorris.json',
            '-p', 'ThreeMensMorris’,
            '-b', 'master',
            '-o', 'creator'
        ]);
    })
    .then(function () {
        console.log('everything is fine')
    })
    .catch(function (err) {
        console.log('something went wrong:', err);
    });

