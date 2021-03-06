'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import BoardEditComponent from './../components/boardedit.jsx';
import ScriptEditComponent from './../components/scriptedit.jsx';
import TaskAssignerComponent from './../components/taskassigner.jsx';

export default class CreatorView extends React.Component {
    constructor(props) {
        var UIPattern = {};

        super(props);

        this.client = this.props.client;

        this.updateScript = this.updateScript.bind(this);
        this.editBoard = this.editBoard.bind(this);
        this.finishBoardEdit = this.finishBoardEdit.bind(this);
        this.editScript = this.editScript.bind(this);
        this.removeScript = this.removeScript.bind(this);
        this.addTask = this.addTask.bind(this);
        this.addCondition = this.addCondition.bind(this);
        this.addFunction = this.addFunction.bind(this);

        this.projectUpdated = this.projectUpdated.bind(this);
        this.getBoardPicture = this.getBoardPicture.bind(this);
        this.getTileInformation = this.getTileInformation.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
        this.taskAssigner = this.taskAssigner.bind(this);
        this.onFinishTaskAssigner = this.onFinishTaskAssigner.bind(this);
        this.addDice = this.addDice.bind(this);
        this.delDice = this.delDice.bind(this);
        this.getFunctionNames = this.getFunctionNames.bind(this);

        UIPattern[this.client.gameId] = {children: 3};

        this.state = {
            target: null,
            phase: 'overview',
            board: this.client.boardId,
            taskContainer: this.client.taskContainerId,
            tasks: [],
            conditionContainer: this.client.conditionContainerId,
            conditions: [],
            functionContainer: this.client.functionContainerId,
            functions: [],
            tiles: [],
            pieces: [],
            hasDice: false
        };

        this.client.addUI(this, this.projectUpdated, 'HanseaticCreator');
        this.client.updateTerritory('HanseaticCreator', UIPattern);
    }

    //gme related functions
    projectUpdated(/*ev*/) {
        //we are not interested in the events themselves - we assume that every major node is in place
        var state = this.state,
            node, i;

        //build up our collections
        node = this.client.getNode(state.taskContainer);
        if (node) {
            state.tasks = node.getChildrenIds();
        } else {
            state.tasks = [];
        }

        node = this.client.getNode(state.conditionContainer);
        if (node) {
            state.conditions = node.getChildrenIds();
        } else {
            state.conditions = [];
        }

        node = this.client.getNode(state.functionContainer);
        if (node) {
            state.functions = node.getChildrenIds();
        } else {
            state.functions = [];
        }

        node = this.client.getNode(state.board);
        if (node) {
            state.tiles = node.getChildrenIds();
        } else {
            state.tiles = [];
        }

        state.pieces = [];
        for (i = 0; i < state.tiles.length; i += 1) {
            node = this.client.getNode(state.tiles[i]);
            if (node) {
                _.union(state.pieces, node.getChildrenIds());
            }
        }

        state.hasDice = this.client.getDiceId() !== null;

        this.setState(state);
    }

    getBoardPicture() {
        var node = this.client.getNode(this.state.board);

        if (node) {
            return node.getAttribute('picture') || "empty.png";
        }

        return "empty.png";
    }

    getTileInformation() {
        var tiles = [],
            tile, i;

        for (i = 0; i < this.state.tiles.length; i += 1) {
            tile = this.client.getNode(this.state.tiles[i]);
            if (tile) {
                tiles.push({
                    id: this.state.tiles[i],
                    x: tile.getRegistry('position').x || 300,
                    y: tile.getRegistry('position').y || 300,
                    position: tile.getAttribute('coordinate'),
                    width: tile.getRegistry('measure').width || 50,
                    height: tile.getRegistry('measure').height || 50,
                    shape: 'rect',
                    color: 'red',
                    isVisible: tile.getAttribute('isVisible')
                });
            }
        }

        return tiles;
    }

    addPlayer() {
        var baseId = this.client.getMetaId('Player'),
            params = {parentId: this.client.gameId},
            result,
            currentActivePlayer,
            gameNode = this.client.getGameNode(),
            numSoFar = this.client.getNumOfPlayers();

        params[baseId] = {};

        this.client.startTransaction('addingNewPlayer');
        result = this.client.createChildren(params);
        result = result[baseId];
        result = this.client.getNode(result);
        if (result) {
            currentActivePlayer = this.client.getNode(gameNode.getPointer('activePlayer').to);
            if (currentActivePlayer) {
                this.client.makePointer(result.getId(), 'next', currentActivePlayer.getPointer('next').to);
                this.client.makePointer(currentActivePlayer.getId(), 'next', result.getId());
            } else {
                this.client.makePointer(result.getId(), 'next', result.getId());
            }
            this.client.makePointer(this.client.gameId, 'activePlayer', result.getId());
            this.client.setAttributes(result.getId(), 'name', 'Player' + (numSoFar + 1));
        }
        this.client.completeTransaction('addingNewPlayerFinished');
    }

    //script
    editScript(event) {
        this.setState({phase: 'editScript', target: event.currentTarget.getAttribute('id')});
    }

    removeScript(event) {
        this.client.delMoreNodes([event.currentTarget.getAttribute('id')], 'remove task');
    }

    updateScript(updateObject) {
        if (updateObject) {
            this.client.startTransaction('update script holder object');
            this.client.setAttributes(updateObject.id, 'name', updateObject.name);
            this.client.setAttributes(updateObject.id, 'script', updateObject.code);
            this.client.setAttributes(updateObject.id, 'description', updateObject.description);
            if (this.state.tasks.indexOf(updateObject.id) !== -1) {
                this.client.makePointer(updateObject.id, 'premise', updateObject.condition);
            }
            this.client.completeTransaction('finished script update');
        }

        this.setState({phase: 'overview', target: null});
    }

    //board
    editBoard() {
        this.setState({phase: 'editBoard'});
    }

    finishBoardEdit(updateObject) {
        var tile,
            tilesToDelete = this.client.getTileIds(),
            baseId = this.client.getMetaId('Tile'),
            params,
            result,
            newTile,
            i;

        if (updateObject) {
            this.client.startTransaction('updating board');
            for (i = 0; i < updateObject.tiles.length; i += 1) {
                tile = updateObject.tiles[i];
                if (tile.id === null) {
                    //creating new tile
                    params = {parentId: this.state.board};
                    params[baseId] = {};
                    result = this.client.createChildren(params, 'adding new tile');
                    newTile = result[baseId];
                    if (newTile) {
                        this.client.setRegistry(newTile, 'position', {x: tile.x, y: tile.y});
                        this.client.setRegistry(newTile, 'measure', {width: tile.width, height: tile.height});
                        this.client.setAttributes(newTile, 'isVisible', tile.isVisible === true);
                        this.client.setAttributes(newTile, 'coordinate', Number(tile.position));
                    }
                } else {
                    //setting tiles to delete
                    tilesToDelete.splice(tilesToDelete.indexOf(tile.id), 1);
                    //update tile
                    this.client.setRegistry(tile.id, 'position', {x: tile.x, y: tile.y});
                    this.client.setRegistry(tile.id, 'measure', {width: tile.width, height: tile.height});
                    this.client.setAttributes(tile.id, 'isVisible', tile.isVisible === true);
                    this.client.setAttributes(tile.id, 'coordinate', Number(tile.position));
                }
            }

            this.client.delMoreNodes(tilesToDelete);

            this.client.setAttributes(this.state.board, 'picture', updateObject.picture);
            this.client.completeTransaction('board updated');
        }
        this.setState({phase: 'overview'});
    }

    //task assignment

    taskAssigner() {
        this.setState({phase: 'taskAssign'});
    }

    onFinishTaskAssigner() {
        this.setState({phase: 'overview'});
    }

    //condition
    addCondition() {
        var baseId = this.client.getMetaId('Condition'),
            params = {parentId: this.state.conditionContainer},
            result;

        params[baseId] = {};
        result = this.client.createChildren(params, 'adding new condition');
        result = result[baseId];
        if (result) {
            this.setState({phase: 'editScript', target: result});
        }
    }

    //function
    addFunction() {
        var baseId = this.client.getMetaId('Function'),
            params = {parentId: this.state.functionContainer},
            result;

        params[baseId] = {};
        result = this.client.createChildren(params, 'adding new function');
        result = result[baseId];
        if (result) {
            this.setState({phase: 'editScript', target: result});
        }
    }

    getFunctionNames() {
        var names = [],
            ids = this.state.functions || [],
            i;

        for (i = 0; i < ids.length; i += 1) {
            names.push(this.client.getNode(ids[i]).getAttribute('name'));
        }

        //the default 'Function' should be removed
        i = names.indexOf('Function');
        if (i !== -1) {
            names.splice(i, 1);
        }
        
        return names;
    }

    //task
    addTask() {
        var baseId = this.client.getMetaId('Task'),
            params = {parentId: this.state.taskContainer},
            result;

        params[baseId] = {};
        result = this.client.createChildren(params, 'adding new task');
        result = result[baseId];
        if (result) {
            this.setState({phase: 'editScript', target: result});
        }

    }

    //dice
    addDice() {
        var params = {parentId: this.client.gameId};

        params[this.client.getMetaId('Dice')] = {};

        this.client.createChildren(params);
    }

    delDice() {
        var diceId = this.client.getDiceId();
        if (diceId) {
            this.client.delMoreNodes([diceId]);
        }
    }

    render() {
        switch (this.state.phase) {
            case 'editScript':
                var node = this.client.getNode(this.state.target);
                return <ScriptEditComponent id={this.state.target}
                                            name={node.getAttribute('name')}
                                            code={node.getAttribute('script') || ""}
                                            update={this.updateScript}
                                            hasCondition={this.state.tasks.indexOf(this.state.target) !== -1}
                                            condition={this.client.getPointerTarget(this.state.target,'premise')}
                                            allConditions={this.client.getAllConditionNames()}
                                            description={node.getAttribute('description') || ""}
                                            functionlist={this.getFunctionNames()}/>;
            case 'editBoard':
                return <BoardEditComponent tiles={this.getTileInformation()}
                                           picture={this.getBoardPicture()} update={this.finishBoardEdit}
                                           client={this.client} boards={this.props.lists.boards}
                                           pieces={this.props.lists.pieces}/>;
            case 'taskAssign':
                return <TaskAssignerComponent client={this.client} onFinish={this.onFinishTaskAssigner}/>;
            default:
                var tasksToEdit = [],
                    tasksToRemove = [],
                    taskDropdowns = [],
                    conditionsToEdit = [],
                    conditionsToRemove = [],
                    conditionDropdowns = [],
                    functionDropdowns = [],
                    functionsToEdit = [],
                    functionsToRemove = [],
                    dice,
                    i, btnClass,
                    id, item;

                //tasks
                for (i = 0; i < this.state.tasks.length; i += 1) {
                    id = this.state.tasks[i];
                    item = this.client.getNode(id);
                    tasksToEdit.push(<li key={id} id={id} onClick={this.editScript}>
                        <a>{item.getAttribute('name')}</a>
                    </li>);
                    tasksToRemove.push(<li key={id} id={id} onClick={this.removeScript}>
                        <a>{item.getAttribute('name')}</a>
                    </li>);
                }
                for (i = 0; i < 2; i += 1) {
                    if (i === 0) {
                        btnClass = "btn btn-warning dropdown-toggle";
                        if (tasksToEdit.length === 0) {
                            btnClass += " disabled";
                        }
                    } else {
                        btnClass = "btn btn-danger dropdown-toggle";
                        if (tasksToRemove.length === 0) {
                            btnClass += " disabled";
                        }
                    }
                    taskDropdowns.push(<div key={"taskDrop"+i} className="btn-group" role="group">
                        <button typeof="button" className={btnClass} type="button"
                                id={"taskDrop"+i} data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                            {i === 0 ? "EditTask" : "RemoveTask"}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={"taskDrop"+i}>
                            {i === 0 ? tasksToEdit : tasksToRemove}
                        </ul>
                    </div>);
                }

                //conditions
                for (i = 0; i < this.state.conditions.length; i += 1) {
                    id = this.state.conditions[i];
                    item = this.client.getNode(id);
                    conditionsToEdit.push(<li key={id} id={id} onClick={this.editScript}>
                        <a>{item.getAttribute('name')}</a>
                    </li>);
                    conditionsToRemove.push(<li key={id} id={id} onClick={this.removeScript}>
                        <a>{item.getAttribute('name')}</a>
                    </li>);
                }
                for (i = 0; i < 2; i += 1) {
                    if (i === 0) {
                        btnClass = "btn btn-warning dropdown-toggle";
                        if (conditionsToEdit.length === 0) {
                            btnClass += " disabled";
                        }
                    } else {
                        btnClass = "btn btn-danger dropdown-toggle";
                        if (conditionsToRemove.length === 0) {
                            btnClass += " disabled";
                        }
                    }
                    conditionDropdowns.push(<div key={"conditionDrop"+i} className="btn-group" role="group">
                        <button typeof="button" className={btnClass} type="button"
                                id={"conditionDrop"+i} data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                            {i === 0 ? "EditCondition" : "RemoveCondition"}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={"conditionDrop"+i}>
                            {i === 0 ? conditionsToEdit : conditionsToRemove}
                        </ul>
                    </div>);
                }

                //functions
                for (i = 0; i < this.state.functions.length; i += 1) {
                    id = this.state.functions[i];
                    item = this.client.getNode(id);
                    functionsToEdit.push(<li key={id} id={id} onClick={this.editScript}>
                        <a>{item.getAttribute('name')}</a>
                    </li>);
                    functionsToRemove.push(<li key={id} id={id} onClick={this.removeScript}>
                        <a>{item.getAttribute('name')}</a>
                    </li>);
                }
                for (i = 0; i < 2; i += 1) {
                    if (i === 0) {
                        btnClass = "btn btn-warning dropdown-toggle";
                        if (functionsToEdit.length === 0) {
                            btnClass += " disabled";
                        }
                    } else {
                        btnClass = "btn btn-danger dropdown-toggle";
                        if (functionsToRemove.length === 0) {
                            btnClass += " disabled";
                        }
                    }
                    functionDropdowns.push(<div key={"functionDrop"+i} className="btn-group" role="group">
                        <button typeof="button" className={btnClass} type="button"
                                id={"functionDrop"+i} data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                            {i === 0 ? "EditFunction" : "RemoveFunction"}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={"functionDrop"+i}>
                            {i === 0 ? functionsToEdit : functionsToRemove}
                        </ul>
                    </div>);
                }

                if (this.state.hasDice) {
                    dice = <button className="btn btn-lg btn-danger" onClick={this.delDice}>Remove dice</button>;
                } else {
                    dice = <button className="btn btn-lg btn-warning" onClick={this.addDice}>Add dice</button>;
                }
                return <div className="col-sm-6">
                    <button className="btn btn-default btn-lg" onClick={this.editBoard}>EditBoard</button>
                    <button className="btn btn-default btn-lg" onClick={this.addPlayer}>
                        AddPlayer <span className="badge">{this.client.getNumOfPlayers()}</span>
                    </button>
                    <button className="btn btn-default btn-lg" onClick={this.taskAssigner}>AssignTasks</button>
                    {dice}
                    <br/>
                    <div className="btn btn-group" role="group">
                        <button type="button" className="btn btn-default" onClick={this.addTask}>
                            AddTask
                        </button>
                        {taskDropdowns}
                    </div>
                    <br/>
                    <div className="btn btn-group" role="group">
                        <button type="button" className="btn btn-default" onClick={this.addCondition}>
                            AddCondition
                        </button>
                        {conditionDropdowns}
                    </div>
                    <div className="btn btn-group" role="group">
                        <button type="button" className="btn btn-default" onClick={this.addFunction}>
                            AddFunction
                        </button>
                        {functionDropdowns}
                    </div>
                </div>
        }
    }

}

CreatorView.propTypes = {
    client: React.PropTypes.object.isRequired,
    lists: React.PropTypes.object.isRequired
};