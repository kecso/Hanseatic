/*jshint node: true*/
/**
 * @author kecso / https://github.com/kecso
 */

var env = process.env.NODE_ENV || 'default',
    configFilename = __dirname + '/config.' + env + '.js',
    config = require(configFilename),
    validateConfig = require('webgme/config/validator');

console.log('validating config');
validateConfig(configFilename);
console.log('config validated');
module.exports = config;