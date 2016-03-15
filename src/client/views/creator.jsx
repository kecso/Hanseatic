'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import BoardEditView from './boardedit.jsx';
import ScriptEditView from './scriptedit.jsx';

export default class CreatorView extends React.Component {
    constructor(props) {

        super(props);

        this.gme = this.props.gmeClient;

        this.updateScript = this.updateScript.bind(this);
        this.editBoard = this.editBoard.bind(this);
        this.finishBoardEdit = this.finishBoardEdit.bind(this);
        this.editTask = this.editTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.removeCondition = this.removeCondition.bind(this);
        this.addCondition = this.addCondition.bind(this);

        this.projectUpdated = this.projectUpdated.bind(this);
        this.getMetaId = this.getMetaId.bind(this);
        this.getBoardPicture = this.getBoardPicture.bind(this);
        this.getTileInformation = this.getTileInformation.bind(this);

        this.state = {
            target: null,
            phase: 'overview',
            board: '/W/e',
            taskContainer: '/W/b',
            tasks: [],
            conditionContainer: '/W/o',
            conditions: [],
            tiles: [],
            pieces: []
        };

        this.gme.addUI(this, this.projectUpdated, 'HanseaticCreator');
        this.gme.updateTerritory('HanseaticCreator', {'/W': {children: 3}});
    }

    //gme related functions
    projectUpdated(/*ev*/) {
        //we are not interested in the events themselves - we assume that every major node is in place
        var state = this.state,
            node, i;

        //build up our collections
        node = this.gme.getNode(state.taskContainer);
        if (node) {
            state.tasks = node.getChildrenIds();
        } else {
            state.tasks = [];
        }

        node = this.gme.getNode(state.conditionContainer);
        if (node) {
            state.conditions = node.getChildrenIds();
        } else {
            state.conditions = [];
        }

        node = this.gme.getNode(state.board);
        if (node) {
            state.tiles = node.getChildrenIds();
        } else {
            state.tiles = [];
        }

        state.pieces = [];
        for (i = 0; i < state.tiles.length; i += 1) {
            node = this.gme.getNode(state.tiles[i]);
            if (node) {
                _.union(state.pieces, node.getChildrenIds());
            }
        }

        this.setState(state);
    }

    getMetaId(name) {
        var metaNodes = this.gme.getAllMetaNodes(),
            i;
        for (i = 0; i < metaNodes.length; i += 1) {
            if (metaNodes[i].getAttribute('name') === name) {
                return metaNodes[i].getId();
            }
        }

        return null;
    }

    getBoardPicture() {
        var node = this.gme.getNode(this.state.board);

        if (node) {
            return node.getAttribute('picture') || "empty.png";
        }

        return "empty.png";
    }

    getTileInformation() {
        var tiles = [],
            tile, i;

        for (i = 0; i < this.state.tiles.length; i += 1) {
            tile = this.gme.getNode(this.state.tiles[i]);
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

    updateScript(updateObject) {
        if (updateObject) {

        }

        this.setState({phase: 'overview', target: null});
    }

    editBoard() {
        this.setState({phase: 'editBoard'});
    }

    finishBoardEdit(updateObject) {
        var tile,
            baseId = this.getMetaId('Tile'),
            params,
            result,
            newTile,
            i;

        if (updateObject) {
            this.gme.startTransaction('updating board');
            for (i = 0; i < updateObject.tiles.length; i += 1) {
                tile = updateObject.tiles[i];
                if (tile.id === null) {
                    //creating new tile
                    params = {parentId: this.state.board};
                    params[baseId] = {};
                    result = this.gme.createChildren(params, 'adding new tile');
                    newTile = result[baseId];
                    if (newTile) {
                        this.gme.setRegistry(newTile, 'position', {x: tile.x, y: tile.y});
                        this.gme.setRegistry(newTile, 'measure', {width: tile.width, height: tile.height});
                        this.gme.setAttributes(newTile, 'isVisible', tile.isVisible === true);
                        this.gme.setAttributes(newTile, 'coordinate', Number(tile.position));
                    }
                } else {
                    //update tile
                    this.gme.setRegistry(tile.id, 'position', {x: tile.x, y: tile.y});
                    this.gme.setRegistry(tile.id, 'measure', {width: tile.width, height: tile.height});
                    this.gme.setAttributes(tile.id, 'isVisible', tile.isVisible === true);
                    this.gme.setAttributes(tile.id, 'coordinate', Number(tile.position));
                }
            }

            this.gme.completeTransaction('board updated');
        }
        this.setState({phase: 'overview'});
    }

    addCondition() {
        var key = 'cond_' + Math.round(Math.random() * 100000), //this will be a result of node creation
            state = this.state;

        state.conditions.push(key);
        state.nodes[key] = {};
        state.phase = 'editScript';
        state.target = key;

        this.setState(state);
    }

    editCondition(event) {
        var key = event.currentTarget.getAttribute('id'),
            state = this.state;

        if (state.phase === 'overview') {
            state.phase = 'editScript';
            state.target = key;

            this.setState(state);
        }
    }

    removeCondition(event) {
        var key = event.currentTarget.getAttribute('id'),
            state = this.state;

        if (this.state.phase === 'overview' && typeof key === 'string') {
            if (state.nodes[key]) {
                delete state.nodes[key];
            }
            if (state.conditions.indexOf[key] !== -1) {
                state.conditions.splice(state.conditions.indexOf(key), 1);
            }
            this.setState(state);
        }
    }

    addTask() {
        var key = 'ketto_' + Math.round(Math.random() * 100000), //this will be a result of node creation
            state = this.state;

        state.tasks.push(key);
        state.nodes[key] = {};
        state.phase = 'editScript';
        state.target = key;

        this.setState(state);
    }

    editTask(event) {
        var key = event.currentTarget.getAttribute('id'),
            state = this.state;

        if (state.phase === 'overview') {
            state.phase = 'editScript';
            state.target = key;

            this.setState(state);
        }
    }

    removeTask(event) {
        var key = event.currentTarget.getAttribute('id'),
            state = this.state;

        if (this.state.phase === 'overview' && typeof key === 'string') {
            console.log('we will remove from the model as well');
            if (state.nodes[key]) {
                delete state.nodes[key];
            }
            if (state.tasks.indexOf[key] !== -1) {
                state.tasks.splice(state.tasks.indexOf(key), 1);
            }
            this.setState(state);
        }
    }

    test(event) {
        console.log('klikk', event);
    }

    render() {
        switch (this.state.phase) {
            case 'editScript':
                return <ScriptEditView id={this.state.target}
                                       name={this.props.core.getAttribute(this.state.nodes[this.state.target],'name')}
                                       code={this.props.core.getAttribute(this.state.nodes[this.state.target],'script')}
                                       update={this.updateScript}/>;
            case 'editBoard':
                return <BoardEditView tiles={this.getTileInformation()}
                                      picture={this.getBoardPicture()} update={this.finishBoardEdit}/>;
            default:
                var tasksToEdit = [],
                    tasksToRemove = [],
                    taskDropdowns = [],
                    conditionsToEdit = [],
                    conditionsToRemove = [],
                    conditionDropdowns = [],
                    i, btnClass,
                    item;
                //tasks
                for (i = 0; i < this.state.tasks.length; i += 1) {
                    item = this.state.tasks[i];
                    tasksToEdit.push(<li key={item} id={item} onClick={this.editTask}>
                        <a>{this.props.core.getAttribute(this.state.nodes[item], 'name')}</a>
                    </li>);
                    tasksToRemove.push(<li key={item} id={item} onClick={this.removeTask}>
                        <a>{this.props.core.getAttribute(this.state.nodes[item], 'name')}</a>
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
                    item = this.state.conditions[i];
                    conditionsToEdit.push(<li key={item} id={item} onClick={this.editCondition}>
                        <a>{this.props.core.getAttribute(this.state.nodes[item], 'name')}</a>
                    </li>);
                    conditionsToRemove.push(<li key={item} id={item} onClick={this.removeCondition}>
                        <a>{this.props.core.getAttribute(this.state.nodes[item], 'name')}</a>
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
                                id={"taskDrop"+i} data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                            {i === 0 ? "EditCondition" : "RemoveCondition"}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={"conditionDrop"+i}>
                            {i === 0 ? conditionsToEdit : conditionsToRemove}
                        </ul>
                    </div>);
                }

                return <div className="col-sm-6">
                    <button className="btn btn-default btn-lg" onClick={this.editBoard}>EditBoard</button>
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
                </div>
        }
    }

}

CreatorView.propTypes = {
    gmeClient: React.PropTypes.object.isRequired
};