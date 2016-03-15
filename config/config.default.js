/*jshint node: true*/
/**
 * @author kecso / https://github.com/kecso
 */

var config = require('webgme/config/config.default');

config.server.port = 9091;

config.mongo.uri = 'mongodb://127.0.0.1:27017/hanseatic';

config.authentication.enable = true;
config.client.appDir = './public';

config.authentication.allowGuests = true;

config.authentication.logOutUrl = '/rest/external/hanseatic';

config.rest.components = {
    'hanseatic': './../../../../src/server/hanseatic'
};

config.seedProjects.basePaths = ['./seeds'];

config.authentication.jwt.publicKey = require('path').join(__dirname, '../__keys__/EXAMPLE_PUBLIC_KEY');
config.authentication.jwt.privateKey = require('path').join(__dirname, '../__keys__/EXAMPLE_PRIVATE_KEY');

module.exports = config;