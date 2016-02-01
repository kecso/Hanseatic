"use strict";


import React from       'react';
import ReactDOM from    'react-dom';
import LandingView from './views/landing.jsx';
import LoginView from './views/login.jsx';
import RegisterView from './views/register.jsx';
import ProfileView from './views/profile.jsx';

module.exports = Backbone.Router.extend({
    routes: {
        'rest/external/hanseatic': '_landing',
        'rest/external/hanseatic/login': '_login',
        'rest/external/hanseatic/register': '_register',
        'rest/external/hanseatic/profile/:profileId': '_profile',
        '*path': '_landing'
    },
    initialize: function (options) {
        this.app = options.app;
        this.view = undefined;
    },

    _landing: function () {
        ReactDOM.render(<LandingView router={this} dispatcher={this.app}/>, document.getElementById('mainDiv'));
    },

    _login: function () {
        ReactDOM.render(<LoginView router={this} dispatcher={this.app}/>, document.getElementById('mainDiv'));
    },

    _register: function () {
        ReactDOM.render(<RegisterView dispatcher={this.app} router={this}/>, document.getElementById('mainDiv'));
    },

    _profile: function (profileId) {
        ReactDOM.render(<ProfileView id={profileId} router={this}
                                     dispatcher={this.app}/>, document.getElementById('mainDiv'));
    },

    _default: function () {
        console.log('Default path taken!!!');
    }
});