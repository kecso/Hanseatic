'use strict';
require('bootstrap-webpack');

var Router  = require('./routes'),
    App  = function() {
    // Establish the global URL router
    this._router = new Router({ app: this });
    Backbone.history.start({ pushState: true });
};

_.extend(App.prototype, Backbone.Events);

module.exports = new App();