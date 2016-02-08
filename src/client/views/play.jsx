'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

/*
 board:[''/'p1'/'p2'...]
 */
import React from 'react';
var $ = require('jquery'),
    Q = require('q'),
    organizationId = 'startingGames',
    UIname = 'HanseaticYeahPlay',
    GUID = require('webgme/src/common/util/guid'),
    gme;

export default class PlayView extends React.Component {
    constructor(props) {
        var self;

        super(props);

        self = this;

        gme = self.props.router.gme;

        //this.onCreate = this.onCreate.bind(this);
        this.projectChanged = this.projectChanged.bind(this);
        this.tileClick = this.tileClick.bind(this);
        this.initialize = this.initialize.bind(this);
        this.amIActive = this.amIActive.bind(this);
        this.getMetaNodeDictionary = this.getMetaNodeDictionary.bind(this);
        this.getMyPlayerNode = this.getMyPlayerNode.bind(this);
        this.getPiecePosition = this.getPiecePosition.bind(this);
        this.step = this.step.bind(this);
        this.setBoard = this.setBoard.bind(this);

        this.state = {
            userId: gme.getUserId(),
            gameId: props.id,
            initialized: false,
            gameNodeId: '',
            boardNodeId: '',
            playerIds: [],
            tileIds: [],
            board: ['_', '_', '_', '_', '_', '_', '_', '_', '_']
        };

        gme.selectProject(organizationId + '+' + this.state.gameId, 'master', function (err) {
            console.log('bumm000', err);
            gme.addUI(self, self.projectChanged, UIname);
            gme.updateTerritory(UIname, {'': {children: 1}});
        });

    }

    tileClick(ev) {
        console.log('tile clicked', ev.currentTarget.getAttribute('name'), this.amIActive());
        this.step(Number(ev.currentTarget.getAttribute('name')));
    }

    getMetaNodeDictionary() {
        var allMetaNodes = gme.getAllMetaNodes(),
            i,
            dictionary = {};

        for (i = 0; i < allMetaNodes.length; i += 1) {
            dictionary[allMetaNodes[i].getAttribute('name')] = allMetaNodes[i];
        }
        return dictionary;
    }

    amIActive() {
        var gameNode = gme.getNode(this.state.gameNodeId);

        return this.state.userId === gme.getNode(gameNode.getPointer('activePlayer').to).getAttribute('id');
    }

    setBoard() {
        var playerNodes = [],
            i, j,
            pieceIds,
            newState = {board: ['_', '_', '_', '_', '_', '_', '_', '_', '_']};

        for (i = 0; i < this.state.playerIds.length; i += 1) {
            playerNodes.push(gme.getNode(this.state.playerIds[i]));
        }

        //now go through all the pieces of a given player
        for (i = 0; i < playerNodes.length; i += 1) {
            pieceIds = playerNodes[i].getMemberIds('myPieces');
            for (j = 0; j < pieceIds.length; j += 1) {
                newState.board[this.getPiecePosition(pieceIds[j])] = playerNodes[i].getAttribute('id');
            }
        }

        //and render it
        this.setState(newState);
    }

    getPiecePosition(pieceId) {
        console.log('piece:', pieceId, this.state);
        var pieceNode = gme.getNode(pieceId),
            tileNode = gme.getNode(pieceNode.getPointer('on').to);

        console.log(pieceNode.getPointer('on'));
        return tileNode.getAttribute('position');
    }

    getMyPlayerNode() {
        var i,
            node;
        for (i = 0; i < this.state.playerIds.length; i += 1) {
            node = gme.getNode(this.state.playerIds[i]);
            if (node.getAttribute('id') === this.state.userId) {
                return node;
            }
        }
    }

    step(position) {
        console.log('step', position);
        if (this.isTileFree(position)) {
            gme.startTransaction('making a move [' + this.state.userId + ']');
            //creating a piece
            var newPieceNodeId = gme.createChild({
                parentId: this.state.gameNodeId,
                baseId: this.getMetaNodeDictionary()['Piece']
            });

            //adding to myPieces set
            gme.addMember(this.getMyPlayerNode().getId(), newPieceNodeId, 'myPieces');

            //put on the tile
            gme.addMember(this.state.tileIds[position], newPieceNodeId, 'piecesOnMe');
            gme.makePointer(newPieceNodeId, 'on', this.state.tileIds[position]);

            //changing active player
            gme.makePointer(this.state.gameNodeId, 'activePlayer', this.getMyPlayerNode().getPointer('next').to);

            //and done
            gme.completeTransaction('making move ' + position, function () {
                console.log('move stored to server');
            });
        } else {
            console.log('bad move');
        }
    }

    isTileFree(position) {
        var tileNode = gme.getNode(this.state.tileIds[Number(position)]);

        return tileNode.getMemberIds('piecesOnMe').length === 0;
    }

    initialize() {
        var gameNode = gme.getNode(this.state.gameNodeId),
            metaDictionary = this.getMetaNodeDictionary(),
            keys, node, newState = {playerIds: []},
            boardNode,
            i,
            self = this;

        //now first find the board node and the player nodes
        keys = gameNode.getChildrenIds();
        for (i = 0; i < keys.length; i += 1) {
            if (gme.isTypeOf(keys[i], metaDictionary['Board'].getId())) {
                newState.boardNodeId = keys[i];
                boardNode = gme.getNode(keys[i]);
            } else if (gme.isTypeOf(keys[i], metaDictionary['Player'].getId())) {
                newState.playerIds.push(keys[i]);
            }
        }

        //now let's identify the tiles
        keys = boardNode.getChildrenIds();
        newState.tileIds = ['', '', '', '', '', '', '', '', ''];
        for (i = 0; i < keys.length; i += 1) {
            node = gme.getNode(keys[i]);
            newState.tileIds[Number(node.getAttribute('position'))] = keys[i];
        }

        newState.initialized = true;

        //and we are done, so let's just render it
        this.setState(newState, function () {
            self.setBoard();
        });
    }

    projectChanged(events) {
        //this is the main event handling function
        console.log('bumm001');
        var gameNode,
            i,
            self = this;
        if (!this.state.gameNodeId) {
            console.log('bumm002');
            for (i = 0; i < events.length; i += 1) {
                if (events[i].etype = 'load') {
                    gameNode = gme.getNode(events[i].eid);

                    if (gameNode && gameNode.getAttribute('name') === 'TicTacToeGame') {
                        this.setState({gameNodeId: events[i].eid}, function () {
                            //and now the registration
                            console.log('bumm003');
                            var territory = {};
                            territory[self.state.gameNodeId] = {children: 2};
                            gme.updateTerritory(UIname, territory);
                        });
                    }
                }
            }
        } else if (!this.state.initialized) {
            console.log('bumm004');
            self.initialize();
        } else {
            //just update the state and let the view visualize it ;)
            console.log('bumm005');
            console.log('yeay', events);
            this.setBoard();
        }
    }

    render() {
        var tiles = [],
            active,
            i;

        if (!this.state.initialized) {
            return <h3>waiting for game initialization</h3>;
        }
        if (this.amIActive()) {
            active = <h3>it is your turn! ;)</h3>;
        } else {
            active = <h3>the other player makes the move! :)</h3>;
        }

        for (i = 0; i < this.state.board.length; i += 1) {
            tiles.push(<div className="col-md-4">
                <button className="btn btn-lg btn-default btn-block" onClick={this.tileClick} name={i}>
                    {this.state.board[i]}
                </button>
            </div>);
        }
        return <div>
            {active}
            <div className="col-md-6">
                {tiles}
            </div>
        </div>
    }
}

PlayView.propTypes = {
    id: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};