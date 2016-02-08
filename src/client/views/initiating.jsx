'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
var $ = require('jquery'),
    Q = require('q'),
    organizationId = 'startingGames',
    UIname = 'HanseaticYeah',
    GUID = require('webgme/src/common/util/guid'),
    gme;

export default class InitiatingView extends React.Component {
    constructor(props) {
        var self;

        super(props);

        self = this;

        gme = self.props.router.gme;

        //this.onCreate = this.onCreate.bind(this);
        this.openUp = this.openUp.bind(this);
        this.register = this.register.bind(this);
        this.projectChanged = this.projectChanged.bind(this);

        this.state = {
            userId: gme.getUserId(),
            gameId: props.id,
            actualPlayers: 0,
            neededPlayers: 0,
            registered: false,
            gameNodeId: ''
        };

        if (!self.state.gameId) {
            //we are the game creators
            self.state.gameId = self.props.seed + '_' + GUID().substring(0, 8);
            gme.seedProject({
                    type: 'file',
                    seedName: self.props.seed,
                    ownerId: organizationId,
                    projectName: self.state.gameId
                }, function (err) {
                    if (err) {
                        console.log('ooops', err);
                    } else {
                        self.openUp();
                    }
                }
            );
        } else {
            self.openUp();
        }

    }

    openUp() {
        //now we connect through socket.io and start listening to the changes of the project
        var self = this;
        Q.nfcall(gme.selectProject, organizationId + '+' + self.state.gameId, 'master')
            .then(function () {
                gme.addUI(self, self.projectChanged, UIname);
                gme.updateTerritory(UIname, {'': {children: 2}});
            })
            .catch(function (error) {
                console.log('problem opening project :/ ', error);
            });
    }

    register() {
        var self = this,
            getMetaNodeDictionary = function () {
                var allMetaNodes = gme.getAllMetaNodes(),
                    i,
                    dictionary = {};

                for (i = 0; i < allMetaNodes.length; i += 1) {
                    dictionary[allMetaNodes[i].getAttribute('name')] = allMetaNodes[i];
                }
                return dictionary;
            },
            getPlayersPaths = function () {
                var players = [],
                    allIds = gme.getNode(self.state.gameNodeId).getChildrenIds(),
                    i,
                    node;
                for (i = 0; i < allIds.length; i += 1) {
                    if (gme.isTypeOf(allIds[i], PlayerNode.getId())) {
                        players.push(allIds[i]);
                    }
                }

                return players;
            },
            PlayerNode = getMetaNodeDictionary()['Player'],
            currentPlayers = getPlayersPaths(),
            gameNode = gme.getNode(this.state.gameNodeId),
            playerNode,
            newPlayerId;

        gme.startTransaction();
        newPlayerId = gme.createChild({
            parentId: self.state.gameNodeId,
            baseId: PlayerNode.getId()
        }, 'registering player: ' + self.state.userId);

        gme.setAttributes(newPlayerId, 'name', self.state.userId);
        gme.setAttributes(newPlayerId, 'id', self.state.userId);

        if (currentPlayers.length === 0) {
            //first user are we?
            gme.makePointer(newPlayerId, 'next', newPlayerId);
        } else {
            playerNode = gme.getNode(currentPlayers[0]);
            gme.makePointer(newPlayerId, 'next', playerNode.getPointer('next').to);
            gme.makePointer(currentPlayers[0], 'next', newPlayerId);
        }
        gme.makePointer(this.state.gameNodeId, 'activePlayer', newPlayerId);
        gme.setAttributes(this.state.gameNodeId,'numOfPlayers', Number(gameNode.getAttribute('numOfPlayers'))+1);
        gme.completeTransaction('player ['+self.state.userId+'] registered', function(){
            self.setState({registered: true},
                function () {
                    self.projectChanged();
                });
        });
    }

    projectChanged(events) {
        //this is the main event handling function
        console.log('one');
        var gameNode,
            i,
            self = this;
        if (!this.state.gameNodeId) {
            console.log('two');
            for (i = 0; i < events.length; i += 1) {
                if (events[i].etype = 'load') {
                    gameNode = gme.getNode(events[i].eid);

                    if (gameNode && gameNode.getAttribute('name') === 'TicTacToeGame') {
                        this.setState({gameNodeId: events[i].eid}, function () {
                            //and now the registration
                            self.register();
                        });
                    }
                }
            }
        } else if (this.state.registered) {
            console.log('three');
            //we already registered, so we just update the counters and if we reach the limit, we start the game
            gameNode = gme.getNode(this.state.gameNodeId);
            if (gameNode) {
                this.setState({
                    actualPlayers: Number(gameNode.getAttribute('numOfPlayers')),
                    neededPlayers: Number(gameNode.getAttribute('minPlayer'))
                }, function () {
                    console.log('are we done?',Number(gameNode.getAttribute('numOfPlayers')) === Number(gameNode.getAttribute('minPlayer')));
                    if (Number(gameNode.getAttribute('numOfPlayers')) === Number(gameNode.getAttribute('minPlayer'))) {
                        gme.removeUI(UIname);
                        self.props.router.navigate('/rest/external/hanseatic/play/' +
                            self.props.id, {trigger: true});
                    }
                });
            }
        }
    }

    render() {
        return <div>
            <h2>{'initiating game [' + this.state.gameId + '](' + this.state.actualPlayers +
            '/' + this.state.neededPlayers + ')'}</h2>
        </div>;
    }
}

InitiatingView.propTypes = {
    id: React.PropTypes.string.isRequired,
    seed: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};