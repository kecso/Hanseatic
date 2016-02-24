/**
 * @author kecso / https://github.com/kecso
 */

function HanseaticGame(gmeClient) {
    //when creating a game it should already have an open connection and project
    var self = this,
        eventFunction = function (events) {
            console.log('events:', events);
        },
        pattern = {'/C': {children: 3}},
        UID = 'HanseaticGameUI',
        initCallback = null,
        metaDictionary;

    //helpers
    function computeMetaNameDictionary() {
        var metaNodes = gmeClient.getAllMetaNodes(),
            i;

        metaDictionary = {};
        for (i = 0; i < metaNodes.length; i += 1) {
            metaDictionary[metaNodes[i].getAttribute('name')] = {id: metaNodes[i].getId(), node: metaNodes[i]};
        }
    }

    function getBoardNode() {
        var gameChildrenIds = gmeClient.getNode('/C').getChildrenIds(),
            i;

        for (i = 0; i < gameChildrenIds.length; i += 1) {
            if (gmeClient.isTypeOf(gameChildrenIds[i], metaDictionary['Board'].id)) {
                return gmeClient.getNode(gameChildrenIds[i]);
            }
        }

        return null;
    }

    function nextPlayer() {
        var nextPlayer;
        nextPlayer = gmeClient.getNode(self.getActivePlayerId()).getPointer('next').to;
        gmeClient.makePointer('/C', 'activePlayer', nextPlayer, 'player [' + nextPlayer + '] is up next');
    }

    function checkCondition(conditionId, targetId) {
        var conditionNode = gmeClient.getNode(conditionId),
            condition = '',
            script;

        if (conditionNode) {
            eval('condition = ' + conditionNode.getAttribute('script') + ';');
            try {
                return condition(self, targetId);
            } catch (e) {
                console.log(e);
                console.log('unable to execute task!!!!');
                return false;
            }
        }

    }

    function executeTask(taskId, targetId) {
        var taskNode = gmeClient.getNode(taskId),
            task = '',
            script,
            condition,
            goOn = true;

        if (taskNode) {
            condition = taskNode.getPointer('condition').to;
            if (condition && !checkCondition(condition, targetId)) {
                goOn = false;
            }

            if (goOn) {
                eval('task = ' + taskNode.getAttribute('script') + ';');
                try {
                    task(self, targetId);
                } catch (e) {
                    console.log(e);
                    console.log('unable to execute task!!!!');
                }

                if (gmeClient.isTypeOf(taskId, metaDictionary['Singlet'].id)) {
                    gmeClient.delMoreNodes([taskId], 'Singlet [' + taskId + '] been executed!');
                }
            }
        } else {
            goOn = false;
        }

        return goOn;
    }

    function getRules() {
        var gameChildren = gmeClient.getNode('/C').getChildrenIds(),
            rulesetNode,
            rules = [],
            i;

        for (i = 0; i < gameChildren.length; i += 1) {
            if (gmeClient.isTypeOf(gameChildren[i], metaDictionary['Ruleset'].id)) {
                rulesetNode = gmeClient.getNode(gameChildren[i]);
            }
        }

        if (rulesetNode) {
            rules = rulesetNode.getChildrenIds();
        }

        return rules;
    }

    function getPlayerIds() {
        var gameChildren = gmeClient.getNode('/C').getChildrenIds(),
            players = [],
            i;

        for (i = 0; i < gameChildren.length; i += 1) {
            if (gmeClient.isTypeOf(gameChildren[i], metaDictionary['Player'].id)) {
                players.push(gameChildren[i]);
            }
        }

        return players;
    }

    //piece class
    function Piece(game, id) {
        var getTileId = function () {
                var mynode = gmeClient.getNode(id),
                    target;

                if (mynode) {
                    target = mynode.getPointer('on').to;
                    if (target) {
                        return target;
                    }
                }
                return null;
            },
            put = function (tileId) {
                console.log('put', tileId);
                gmeClient.makePointer(id, 'on', tileId, 'put [' + id + '] onto [' + tileId + ']');
            };
        return {
            on: getTileId(),
            put: put
        };
    }

    //playerClass
    function Player(id) {
        return {
            won: function () {
                gmeClient.startTransaction('_won-');
                gmeClient.setAttributes('/C', 'finished', true);
                gmeClient.setAttributes(id, 'winner', true);
                gmeClient.completeTransaction('-won_');
            }
        }
    }

    this.initialize = function (callback) {
        var self = this;

        initCallback = callback;

        gmeClient.addUI(self, self.projectUpdated, UID);
        gmeClient.updateTerritory(UID, pattern);
    };

    this.projectUpdated = function (ev) {
        //for now we are not checking the change, we just expect everything to be loaded
        computeMetaNameDictionary();

        if (initCallback === null) {
            eventFunction(); //updating the UI
        } else {
            var cb = initCallback;
            initCallback = null;
            cb();
        }
    };

    this.getBoardDimensions = function () {
        var boardNode = getBoardNode(),
            dimensions = {x: 0, y: 0};

        if (boardNode && gmeClient.isTypeOf(boardNode.getId(), metaDictionary['StandardBoard'].id)) {
            dimensions.x = boardNode.getAttribute('x');
            dimensions.y = boardNode.getAttribute('y');
        }

        return dimensions;
    };

    this.getStringBoard = function () {
        var tileIds = this.getTileIds(),
            board = [],
            boardChildren = getBoardNode().getChildrenIds(),
            target,
            node,
            i;

        for (i = 0; i < tileIds.length; i += 1) {
            board.push('');
        }

        for (i = 0; i < boardChildren.length; i += 1) {
            if (gmeClient.isTypeOf(boardChildren[i], metaDictionary['Piece'].id)) {
                node = gmeClient.getNode(boardChildren[i]);
                target = node.getPointer('on').to;

                if (target) {
                    board[tileIds.indexOf(target)] = node.getAttribute('name');
                }
            }
        }

        return board;
    };

    this.getTileIds = function () {
        var boardChildren = getBoardNode().getChildrenIds(),
            tileIds = [],
            tileDictionary = {},
            node,
            posFound = true,
            i;

        for (i = 0; i < boardChildren.length; i += 1) {
            if (gmeClient.isTypeOf(boardChildren[i], metaDictionary['Tile'].id)) {
                node = gmeClient.getNode(boardChildren[i]);
                tileDictionary[Number(node.getAttribute('position'))] = boardChildren[i];
            }
        }

        i = 0;
        while (Object.keys(tileDictionary).length > 0 && posFound) {
            posFound = false;
            if (tileDictionary[i]) {
                posFound = true;
                tileIds.push(tileDictionary[i]);
                i += 1;
            }
        }
        return tileIds;
    };

    this.getActivePlayerName = function () {
        return gmeClient.getNode(gmeClient.getNode('/C').getPointer('activePlayer').to).getAttribute('name');
    };

    this.getActivePlayerId = function () {
        return gmeClient.getNode(gmeClient.getNode('/C').getPointer('activePlayer').to).getId();
    };

    this.subscribe = function (eventFunction_) {
        eventFunction = eventFunction_;
    };

    this.pressed = function (tileOrPieceId) {
        console.log('yeaaah ' + tileOrPieceId);
        var node = gmeClient.getNode(tileOrPieceId),
            tasks;
        if (node) {
            gmeClient.startTransaction('[' + this.getActivePlayerName() + '] make a move');
            //TODO how to have multiple tasks and/or multiple conditions
            tasks = node.getChildrenIds();
            if (tasks && tasks.length > 0) {
                if (executeTask(tasks[0], tileOrPieceId)) {
                    nextPlayer();
                }
            }

            gmeClient.completeTransaction('[' + this.getActivePlayerName() + '] made a move');
        } else {
            console.log('someone pushed something wrong!!!');
        }
    };

    this.getMyPieces = function () {
        //now it actually returns the activePlayer's  pieces as an array of Piece objects
        var pieces = [],
            boardChildren = getBoardNode().getChildrenIds(),
            i,
            node;

        for (i = 0; i < boardChildren.length; i += 1) {
            if (gmeClient.isTypeOf(boardChildren[i], metaDictionary['Piece'].id)) {
                node = gmeClient.getNode(boardChildren[i]);
                if (node && this.getActivePlayerId() === node.getPointer('owner').to) {
                    pieces.push(new Piece(this, boardChildren[i]));
                }
            }
        }

        return pieces;
    };

    this.getAllPieces = function () {
        //now it actually returns the activePlayer's  pieces as an array of Piece objects
        var pieces = [],
            boardChildren = getBoardNode().getChildrenIds(),
            i;

        for (i = 0; i < boardChildren.length; i += 1) {
            if (gmeClient.isTypeOf(boardChildren[i], metaDictionary['Piece'].id)) {
                pieces.push(new Piece(this, boardChildren[i]));
            }
        }

        return pieces;
    };

    this.isOngoing = function () {
        return gmeClient.getNode('/C').getAttribute('finished') === false;
    };

    this.getWinnerName = function () {
        if (this.isOngoing()) {
            return '';
        }

        var players = getPlayerIds(),
            i,
            node;

        for (i = 0; i < players.length; i += 1) {
            node = gmeClient.getNode(players[i]);
            if (node.getAttribute('winner')) {
                return node.getAttribute('name');
            }
        }

        return '';
    };

    this.isEnding = function () {
        //execute win condition, and act according that
        var rules = getRules(),
            i;

        for (i = 0; i < rules.length; i += 1) {
            if (gmeClient.isTypeOf(rules[i], metaDictionary['WinConditionRule'].id)) {
                executeTask(rules[i]);
            }
        }

    };

    this.ended = function () {
        gmeClient.setAttributes('/C', 'finished', true);
    };

    this.getPlayerByName = function (name) {
        var players = getPlayerIds(),
            i,
            node;

        for (i = 0; i < players.length; i += 1) {
            node = gmeClient.getNode(players[i]);
            if (node.getAttribute('name') === name) {
                return new Player(players[i]);
            }
        }

        return null;
    };
}
module.exports = HanseaticGame;