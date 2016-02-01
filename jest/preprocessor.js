/**
 * @author kecso / https://github.com/kecso
 */
var ReactTools = require('react-tools');
var to5 = require('6to5-jest').process;
var babelJest = require('babel-jest');
var webpackAlias = require('jest-webpack-alias');

module.exports = {
    process: function(src, filename) {
        src = ReactTools.transform(to5(src, filename));
        if (filename.indexOf('node_modules') === -1) {
            src = babelJest.process(src, filename);
            src = webpackAlias.process(src, filename);
        }
        return src;
    }
};