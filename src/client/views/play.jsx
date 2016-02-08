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
    organizationId = 'basicGamers',
    UIname = 'HanseaticYeah',
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

        this.state = {
            userId: gme.getUserId(),
            gameId: props.id,
            initialized: false,
            gameNodeId: '',
            boardNodeId: '',
            tileIds: [],
            board: ['', '', '', '', '', '', '', '', '']
        };

        gme.selectProject(organizationId + '+' + this.state.gameId, 'master', function () {
            console.log('bumm000');
            gme.addUI(self, self.projectChanged, UIname);
            gme.updateTerritory(UIname, {'': {children: 1}});
        });

    }

    tileClick(ev) {
        console.log('tile clicked', ev.currentTarget.getAttribute('name'), this.amIActive());
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

    initialize() {
        var gameNode = gme.getNode(this.state.gameNodeId),
            metaDictionary = this.getMetaNodeDictionary(),
            keys, node, newState = {},
            boardNode,
            i;

        //now first find the board node
        keys = gameNode.getChildrenIds();
        for (i = 0; i < keys.length; i += 1) {
            if (gme.isTypeOf(keys[i], metaDictionary['Board'].getId())) {
                newState.boardNodeId = keys[i];
                boardNode = gme.getNode(keys[i]);
            }
        }

        //now let's identify the tiles
        keys = boardNode.getChildrenIds();
        newState.tileIds = ['', '', '', '', '', '', '', '', ''];
        for (i = 0; i < keys.length; i += 1) {
            node = gme.getNode(keys[i]);
            newState.tileIds[Number(node.getAttribute('position'))] = keys[i];
        }

        newState, initialized = true;

        //and we are done, so let's just render it
        this.setState(newState);
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
            console.log('yeay');
        }
    }

    render() {
        var tiles = [],
            active,
            i;

        if (!this.state.initialized) {
            return <h1>waiting for game initialization</h1>;
        }
        if (this.amIActive()) {
            active = <h1>it is your turn! ;)</h1>;
        } else {
            active = <h1>the other player makes the move! :)</h1>;
        }

        for (i = 0; i < this.state.board.length; i += 1) {
            tiles.push(<div className="col-xs-4">
                <button className="btn btn-default btn-block" onClick={this.tileClick} name={i}>
                    {this.state.board[i]}
                </button>
            </div>);
        }
        return <div>
            {active}
            <div className="col-xs-6">
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