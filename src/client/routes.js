"use strict";

import React from       'react';
import ReactDOM from    'react-dom';
import LandingView from './views/landing.jsx';
import LoginView from './views/login.jsx';
import RegisterView from './views/register.jsx';
import ProfileView from './views/profile.jsx';
import InitiatingView from './views/initiating.jsx';
import PlayView from './views/play.jsx';
import StaticView from './views/static.jsx';
import TicTacToeView from './views/tictactoe.jsx';
import CreatorView from './views/creator.jsx';

var $ = require('jquery'),
    HanseaticGame = require('./HanseaticGame'),
    Q = require('q');

module.exports = Backbone.Router.extend({
    routes: {
        'rest/external/hanseatic': '_landing',
        'rest/external/hanseatic/login': '_login',
        'rest/external/hanseatic/register': '_register',
        'rest/external/hanseatic/profile/:profileId': '_profile',
        'rest/external/hanseatic/initiating/:gameType': '_initiatingNull',
        'rest/external/hanseatic/initiating/:gameType/:gameId': '_initiating',
        'rest/external/hanseatic/play/:gameId': '_play',
        'rest/external/hanseatic/static': '_static',
        'rest/external/hanseatic/tictactoe': '_tictactoe',
        'rest/external/hanseatic/creator': '_creator',
        '*path': '_landing'
    },

    initialize: function (options) {
        this.app = options.app;
        this.view = undefined;
        //this.gme = new GME.classes.Client(GME.gmeConfig);
        //
        //this.gme.connectToDatabase(function(){
        //   console.log('connected');
        //});
        this.initialized = false;

        var self = this;

        $.getScript('/rest/external/hanseatic/gme', function () {
            setTimeout(function () {
                self.gme = new GME.classes.Client(GME.gmeConfig);
                self.gme.connectToDatabase(function () {
                    console.log('gme-connected');
                    self.initialized = true;
                });
            }, 500);
        });

        //binding
        self._tictactoe = self._tictactoe.bind(this);
        self.__waitForGme = self.__waitForGme.bind(this);
        self.__createGameFromSeed = self.__createGameFromSeed.bind(this);
        self.__initializeGame = self.__initializeGame.bind(this);
        self.__openProject = self.__openProject.bind(this);
    },

    __waitForGme: function (callback) {
        var timer,
            gme,
            self = this;

        timer = setInterval(function () {
            if (self.initialized) {
                clearInterval(timer);
                gme = self.gme;
                console.log('gme-user:' + 'dunno');
                callback();
            }
        }, 100);
    },

    __openProject: function (projectId, callback) {
        var self = this;

        self.gme.selectProject('guest+' + projectId, 'master', callback);

    },

    __createGameFromSeed: function (seedName, callback) {
        this.gameId = seedName + '_' + Math.round(Math.random() * 10000);
        this.gme.seedProject({
            type: 'file',
            projectName: this.gameId,
            seedName: seedName,
            ownerId: 'guest'
        }, callback);
    },

    __initializeGame: function (callback) {
        var self = this;
        self.game = new HanseaticGame(self.gme, self.gme.getActiveProjectId());
        self.game.initialize(callback);
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

    _initiatingNull: function (gameType) {
        ReactDOM.render(<InitiatingView id="" seed={gameType} router={this} dispatcher={this.app}/>,
            document.getElementById('mainDiv'));
    },
    _initiating: function (gameType, gameId) {
        ReactDOM.render(<InitiatingView id={gameId} seed={gameType} router={this}
                                        dispatcher={this.app}/>, document.getElementById('mainDiv'));
    },

    _play: function (gameId) {
        //var self = this;
        //Q.nfcall(self.__openProject, gameId)
        //    .then(function () {
        //        return Q.nfcall(self.__initializeGame);
        //    })
        //    .then(function () {
        //        ReactDOM.render(<PlayView id={gameId} router={self}
        //                                  dispatcher={self.app} gme={self.gme} game={self.game}/>,
        //            document.getElementById('mainDiv'));
        //    })
        //    .catch(function (err) {
        //        console.log(err);
        //    });
        console.log('ehune');
    },

    _static: function () {
        ReactDOM.render(<StaticView/>, document.getElementById('mainDiv'));
    },

    _creator: function () {
        var self = this;
        Q.nfcall(self.__waitForGme)
            .then(function () {
                return Q.nfcall(self.__createGameFromSeed, 'TicTacToe3');
            })
            .then(function () {
                return Q.nfcall(self.__openProject, 'Demo3_001');
            })
            .then(function () {
                ReactDOM.render(<CreatorView gmeClient={self.gme}/>,
                    document.getElementById('mainDiv'));
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    _tictactoe: function () {
        var self = this;

        console.log('igyni');
        Q.nfcall(self.__waitForGme)
            .then(function () {
                return Q.nfcall(self.__createGameFromSeed, 'TicTacToe3');
            })
            .then(function () {
                return Q.nfcall(self.__openProject, self.gameId);
            })
            .then(function () {
                return Q.nfcall(self.__initializeGame);
            })
            .then(function () {
                ReactDOM.render(<TicTacToeView router={self}
                                               dispatcher={self.app} gme={self.gme} game={self.game}/>,
                    document.getElementById('mainDiv'));
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    _default: function () {
        console.log('Default path taken!!!');
    }
});