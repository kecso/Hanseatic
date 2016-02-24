'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

/*
 board:[''/'p1'/'p2'...]
 */
import React from 'react';
import StandardBoard from '../components/StandardBoard.jsx';

var $ = require('jquery'),
    Q = require('q'),
    organizationId = 'startingGames',
    UIname = 'HanseaticYeahPlay',
    gme;

export default class PlayView extends React.Component {
    constructor(props) {
        var self;

        super(props);

        self = this;

        gme = self.props.gme;

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
        this.isTileFree = this.isTileFree.bind(this);
        this.isTheGameOver = this.isTheGameOver.bind(this);
        this.archiveStep = this.archiveStep.bind(this);

        //this.state = {
        //    userId: gme.getUserId(),
        //    gameId: props.id,
        //    initialized: false,
        //    gameNodeId: '',
        //    archiveContainerId: '',
        //    boardNodeId: '',
        //    playerIds: [],
        //    tileIds: [],
        //    board: ['_', '_', '_', '_', '_', '_', '_', '_', '_']
        //};
        //
        //gme.selectProject(organizationId + '+' + this.state.gameId, 'master', function (err) {
        //    console.log('bumm000', err);
        //    gme.addUI(self, self.projectChanged, UIname);
        //    gme.updateTerritory(UIname, {'': {children: 1}});
        //});

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
        if (this.isTheGameOver()) {
            console.log('the game is over!!!');
            return;
        }
        if (!this.amIActive()) {
            console.log('hey, do not get greedy, it is not your turn!');
            return;
        }
        if (!this.isTileFree(position)) {
            console.log('bad move, choose and empty space!!');
            return;
        }

        gme.startTransaction('making a move [' + this.state.userId + ']');
        //archiving
        this.archiveStep();

        //creating a piece
        var newPieceNodeId = gme.createChild({
            parentId: this.state.gameNodeId,
            baseId: this.getMetaNodeDictionary()['Piece'].getId()
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
    }

    isTileFree(position) {
        var tileNode = gme.getNode(this.state.tileIds[Number(position)]);

        return tileNode.getMemberIds('piecesOnMe').length === 0;
    }

    archiveStep() {
        //we should be in a transatcion!!!
        var standingId = gme.createChild({
                parentId: this.state.archiveContainerId,
                baseId: this.getMetaNodeDictionary()['Standing'].getId()
            }),
            copyParams = {parentId: standingId};

        copyParams[this.state.gameNodeId] = {};

        gme.copyMoreNodes(copyParams);

        //and that is how its done :)
        //of course we should put it into a chain, so it can be played back easily
    }

    isTheGameOver() {
        //we just checks the board...
        var i, weHaveFreeTile = false,
            board = this.state.board;

        for (i = 0; i < board.length; i += 1) {
            if (board[i] === '_') {
                weHaveFreeTile = true;
            }
        }

        if (!weHaveFreeTile) {
            return true;
        }

        if ((board[0] !== '_' && board[0] === board[1] && board[0] === board[2]) ||
            (board[3] !== '_' && board[3] === board[4] && board[3] === board[5]) ||
            (board[6] !== '_' && board[6] === board[7] && board[6] === board[8]) ||
            (board[0] !== '_' && board[0] === board[3] && board[0] === board[6]) ||
            (board[1] !== '_' && board[1] === board[4] && board[1] === board[7]) ||
            (board[2] !== '_' && board[2] === board[5] && board[2] === board[8]) ||
            (board[0] !== '_' && board[0] === board[4] && board[0] === board[8]) ||
            (board[2] !== '_' && board[2] === board[4] && board[2] === board[6])) {
            return true;
        }

        return false;
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
            self = this,
            territory = {},
            newState = {};
        if (!this.state.gameNodeId) {
            console.log('bumm002');
            for (i = 0; i < events.length; i += 1) {
                if (events[i].etype = 'load') {
                    gameNode = gme.getNode(events[i].eid);

                    if (gameNode && gameNode.getAttribute('name') === 'TicTacToeArchive') {
                        newState.archiveContainerId = events[i].eid;
                        territory[events[i].eid] = {children: 0};
                        if (Object.keys(territory).length === 2) {
                            this.setState(newState, function () {
                                //and now the registration
                                gme.updateTerritory(UIname, territory);
                            });
                        }
                    } else if (gameNode && gameNode.getAttribute('name') === 'TicTacToeGame') {
                        newState.gameNodeId = events[i].eid;
                        territory[events[i].eid] = {children: 2};
                        if (Object.keys(territory).length === 2) {
                            this.setState(newState, function () {
                                //and now the registration
                                gme.updateTerritory(UIname, territory);
                            });
                        }
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

    //render() {
    //    var tiles = [],
    //        active,
    //        i;
    //
    //    if (!this.state.initialized) {
    //        return <h3>waiting for game initialization</h3>;
    //    }
    //    if (this.amIActive()) {
    //        active = <h3>it is your turn! ;)</h3>;
    //    } else {
    //        active = <h3>the other player makes the move! :)</h3>;
    //    }
    //
    //    for (i = 0; i < this.state.board.length; i += 1) {
    //        tiles.push(<div className="col-md-4">
    //            <button className="btn btn-lg btn-default btn-block" onClick={this.tileClick} name={i}>
    //                {this.state.board[i]}
    //            </button>
    //        </div>);
    //    }
    //    return <div>
    //        {active}
    //        <div className="col-md-6">
    //            {tiles}
    //        </div>
    //    </div>
    //}
    //render(){
    //    return <svg width="600" height="600">
    //        <rect x="0" y="0" width="200" height="200" name="T0" onClick={this.tileClick}
    //              style=fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="200" y="0" width="200" height="200" name="T1" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="400" y="0" width="200" height="200" name="T2" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="0" y="200" width="200" height="200" name="T3" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="200" y="200" width="200" height="200" name="T4" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="400" y="200" width="200" height="200" name="T5" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="0" y="400" width="200" height="200" name="T6" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="200" y="400" width="200" height="200" name="T7" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //        <rect x="400" y="400" width="200" height="200" name="T8" onClick={this.tileClick}
    //              style="fill:none;stroke:pink;stroke-width:5" />
    //    </svg>
    //}

    render() {
        return <StandardBoard userId={gme.getUserId()}
                              boardNodeId={this.props.game.getBoardNodeId()} hGame={this.props.game}/>
    }

}

PlayView.propTypes = {
    id: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired,
    gme: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired

};