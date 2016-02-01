/*jshint node: true*/
/**
 * @author kecso / https://github.com/kecso
 */

var config = require('webgme/config/config.default');

config.server.port = 9091;

config.mongo.uri = 'mongodb://127.0.0.1:27017/hanseatic';

config.authentication.enable = false;
config.client.appDir = './public';

config.authentication.allowGuests = false;

config.authentication.logOutUrl = '/rest/external/hanseatic';

config.rest.components = {
    'hanseatic':'./../../../../src/server/hanseatic'
};

config.seedProjects.basePaths = ['./seeds'];

module.exports = config;