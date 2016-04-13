"use strict";

import React from       'react';
import ReactDOM from    'react-dom';
import LandingView from './views/landing.jsx';
import CreatorView from './views/creator.jsx';
import ArchiveView from './views/archive.jsx';
import PlayerView from './views/player.jsx';

var $ = require('jquery'),
    HanseaticClient = require('./helper/hanseaticClient'),
    Q = require('q');

module.exports = Backbone.Router.extend({
    routes: {
        'rest/external/hanseatic': '_landing',
        'rest/external/hanseatic/player/:gameId': '_player',
        'rest/external/hanseatic/creator/:gameId': '_creator',
        'rest/external/hanseatic/archive/:gameId': '_archive',
        '*path': '_landing'
    },

    initialize: function (options) {
        this.app = options.app;
        this.view = undefined;
        this.initialized = false;

        var self = this;

        $.getScript('/rest/external/hanseatic/gme', function () {
            setTimeout(function () {
                self.gme = new GME.classes.Client(GME.gmeConfig);
                self.hanseaticClient = new HanseaticClient(self.gme);
                self.gme.connectToDatabase(function () {
                    console.log('gme-connected');
                    self.initialized = true;
                });
            }, 500);
        });

        //binding
        self.__waitForGme = self.__waitForGme.bind(this);
        self.__openProject = self.__openProject.bind(this);
        self.__getHistory = self.__getHistory.bind(this);
        self.__buildTaskProcessor = self.__buildTaskProcessor.bind(this);
    },

    __buildTaskProcessor: function () {
        var deferred = Q.defer(),
            UIPattern = {},
            client = this.hanseaticClient,
            nodesAreLoaded = function (/*events*/) {
                var classTaskProcessor,
                    txtClass = 'classTaskProcessor = function(game){ ',
                    i,
                    conditionNames = {},
                    ids,
                    condition,
                    condChecker = 'this.isValid = function(taskName,targetId){ switch(taskName){',
                    name,
                    item;

                //first adding functions
                ids = client.getFunctionContainerNode().getChildrenIds();
                txtClass += 'var ';
                for (i = 0; i < ids.length; i += 1) {
                    item = client.getNode(ids[i]);
                    txtClass += item.getAttribute('name') + ' = ' + item.getAttribute('script') + ',';
                }
                txtClass += 'endFunctions = true;';

                //now adding conditions as functions
                ids = client.getConditionContainerNode().getChildrenIds();
                txtClass += 'var ';
                for (i = 0; i < ids.length; i += 1) {
                    item = client.getNode(ids[i]);
                    conditionNames[ids[i]] = item.getAttribute('name');
                    txtClass += item.getAttribute('name') + ' = ' + item.getAttribute('script') + ',';
                }
                txtClass += 'endConditions = true;';

                //finally making the tasks accessible to outside world
                ids = client.getTaskContainerNode().getChildrenIds();
                for (i = 0; i < ids.length; i += 1) {
                    item = client.getNode(ids[i]);
                    name = item.getAttribute('name');
                    condition = client.getPointerTarget(ids[i], 'premise');
                    txtClass += 'this.' + name + ' = ' + item.getAttribute('script') + ';';
                    if (condition) {
                        condChecker += 'case \'' + name + '\': return '
                            + client.getNode(condition).getAttribute('name') + '(targetId);';
                    }
                }

                //closing condition checker and adding to the class
                condChecker+='default: return true;}};';
                txtClass+=condChecker;
                //closing the class
                txtClass += 'return this;}';

                //now try to evaluate what we just built
                try {
                    eval(txtClass);
                    deferred.resolve(new classTaskProcessor(client));
                }
                catch (e) {
                    console.log(e);
                    deferred.reject(new Error('unable to build task processor'));
                }
            };

        UIPattern[client.gameId] = {children: 3};

        client.addUI(this, nodesAreLoaded, 'HanseaticTaskBuilder');
        client.updateTerritory('HanseaticTaskBuilder', UIPattern);
        return deferred.promise;
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

        self.gme.selectProject(projectId, 'master', callback);

    },

    __collectsLists: function (callback) {
        $.getJSON('/rest/external/hanseatic/lists', null, function (response, status) {
            if (status === 'success') {
                callback(null, response);
            } else {
                callback(new Error('cannot get lists:', status));
            }
        });
    },

    __getHistory: function (callback) {
        var self = this,
            history = [],
            work = false,
            start = self.hanseaticClient.getActiveCommitHash(),
            needMore = true,
            timerId = setInterval(function () {
                if (!work && needMore) {
                    work = true;
                    self.hanseaticClient.getHistory(self.hanseaticClient.getActiveProjectId(),
                        start, 1000, function (err, commits) {
                            if (err) {
                                clearInterval(timerId);
                                callback(err);
                                return;
                            }

                            if (commits.length < 1000) {
                                needMore = false;
                            }

                            for (var i = 0; i < commits.length; i += 1) {
                                history.push(commits[i]._id);
                                start = commits[i]._id;
                            }
                            work = false;
                        }
                    );
                }

                if (!work && !needMore) {
                    clearInterval(timerId);
                    callback(null, history);
                }
            }, 1);
    },

    _landing: function () {
        var self = this;
        Q.nfcall(self.__waitForGme)
            .then(function (lists) {
                ReactDOM.render(<LandingView client={self.hanseaticClient} router={self}/>,
                    document.getElementById('mainDiv'));
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    _player: function (gameId) {
        var self = this;
        Q.nfcall(self.__waitForGme)
            .then(function () {
                return Q.nfcall(self.__openProject, gameId);
            })
            .then(function () {
                return self.__buildTaskProcessor();
            })
            .then(function (taskProcessor) {
                console.log(taskProcessor);
                ReactDOM.render(<PlayerView client={self.hanseaticClient} taskProcessor={taskProcessor}/>,
                    document.getElementById('mainDiv'));
            })
            .catch(function (err) {
                console.log(err);
            })
    },

    _creator: function (projectId) {
        var self = this;
        Q.nfcall(self.__waitForGme)
            .then(function () {
                return Q.nfcall(self.__openProject, projectId);
            })
            .then(function () {
                return Q.nfcall(self.__collectsLists);
            })
            .then(function (lists) {
                ReactDOM.render(<CreatorView client={self.hanseaticClient} lists={lists}/>,
                    document.getElementById('mainDiv'));
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    _archive: function (gameId) {
        var self = this;
        Q.nfcall(self.__waitForGme)
            .then(function () {
                return Q.nfcall(self.__openProject, gameId);
            })
            .then(function () {
                return Q.nfcall(self.__getHistory);
            })
            .then(function (history) {
                console.log('history', history);
                ReactDOM.render(<ArchiveView client={self.hanseaticClient} history={history}/>,
                    document.getElementById('mainDiv'));
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    _default: function () {
        console.log('unknown path, redirect to landing screen');
        self.navigate('rest/external/hanseatic/', {trigger: true});
    }
});