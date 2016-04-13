/**
 * @author kecso / https://github.com/kecso
 */

function HanseaticClient(gmeClient) {

    //to allow the helper to be a single source of client, it will provide all funcitons of the gmeClient
    var i,
        GAMEID = '/W';

    for (i in gmeClient) {
        this[i] = gmeClient[i];
    }

    //now the new functions
    this.gameId = GAMEID;
    this.boardId = GAMEID + '/e';
    this.taskContainerId = GAMEID + '/b';
    this.conditionContainerId = GAMEID + '/o';
    this.functionContainerId = GAMEID + '/p';

    this.getGameNode = function () {
        return this.getNode(GAMEID);
    };

    this.getBoardNode = function () {
        return this.getNode(this.boardId);
    };

    this.getTaskContainerNode = function () {
        return this.getNode(this.taskContainerId);
    };

    this.getConditionContainerNode = function () {
        return this.getNode(this.conditionContainerId);
    };

    this.getFunctionContainerNode = function () {
        return this.getNode(this.functionContainerId);
    };

    this.getPointerTarget = function (sourceId, pointerName) {
        return this.getNode(sourceId).getPointer(pointerName).to;
    };

    this.getMetaId = function (name) {
        var metaNodes = this.getAllMetaNodes(),
            i;
        for (i = 0; i < metaNodes.length; i += 1) {
            if (metaNodes[i].getAttribute('name') === name) {
                return metaNodes[i].getId();
            }
        }

        return null;
    };

    this.isTile = function (id) {
        var node = this.getNode(id);
        if (node) {
            return node.getMetaTypeId() === this.getMetaId('Tile');
        }
        return false;
    };

    this.isPiece = function (id) {
        var node = this.getNode(id);
        if (node) {
            return node.getMetaTypeId() === this.getMetaId('Piece');
        }
        return false;
    };

    this.getTileIdOfCoordinate = function (coordinate) {
        var tilesIds = this.getTileIds(),
            i,
            item;
        for (i = 0; i < tilesIds.length; i += 1) {
            item = this.getNode(tilesIds[i]);
            if (Number(coordinate) === Number(item.getAttribute('coordinate'))) {
                return tilesIds[i];
            }
        }
        return null;
    };

    this.getPlayerIds = function () {
        var playerIds = [],
            gameNode = this.getGameNode(),
            player = gameNode === null ? null : this.getPointerTarget(GAMEID, 'activePlayer'),
            notFinished = true;

        while (player && notFinished) {
            if (playerIds.indexOf(player) === -1) {
                playerIds.push(player);
                player = this.getPointerTarget(player, 'next');
            } else {
                notFinished = false;
            }
        }

        return playerIds;
    };

    this.getPlayerName = function (playerId) {
        return this.getNode(playerId).getAttribute('name');
    };

    this.getActivePlayerId = function () {
        return this.getPointerTarget(this.gameId, 'activePlayer')
    };

    this.getTileIds = function () {
        return this.getBoardNode().getChildrenIds();
    };

    this.getTaskIds = function () {
        return this.getTaskContainerNode().getChildrenIds();
    };

    this.getAllPieceIdsOnTile = function (tileId) {
        return this.getNode(tileId).getChildrenIds();
    };

    this.getTasksOfElement = function (ownerId) {
        return this.getNode(ownerId).getMemberIds('possibleTasks');
    };

    this.getNumOfPlayers = function () {
        return this.getPlayerIds().length;
    };

    this.getFunctionNames = function () {
        var names = [],
            ids = this.getFunctionContainerNode().getChildrenIds(),
            i;

        for (i = 0; i < ids.length; i += 1) {
            names.push(this.getNode(ids[i]).getAttribute('name'));
        }
        return names;
    };

    this.getAllConditionNames = function () {
        var names = {},
            ids = this.getConditionContainerNode().getChildrenIds(),
            i;

        for (i = 0; i < ids.length; i += 1) {
            names[ids[i]] = this.getNode(ids[i]).getAttribute('name');
        }
        return names;
    };

    this.getPossibleTaskNames = function (id) {
        var node = this.getNode(id),
            tasks = [],
            allTaskIds,
            item,
            i;
        if (node) {
            allTaskIds = node.getMemberIds('possibleTasks');
            for (i = 0; i < allTaskIds.length; i += 1) {
                item = this.getNode(allTaskIds[i]);
                if (node) {
                    tasks.push(item.getAttribute('name'));
                }
            }
        }

        return tasks;
    };
}
module.exports = HanseaticClient;