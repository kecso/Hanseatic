'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import BoardViewComponent from '../components/boardview.jsx';
import GameStateComponent from '../components/gamestate.jsx';
import ContextMenuComponent from '../components/contextmenu.jsx';
import HomeComponent from '../components/homecomponent.jsx';
import DiceComponent from '../components/dice.jsx';

export default class PlayerView extends React.Component {
    constructor(props) {

        super(props);

        this.client = this.props.client;
        this.taskProcessor = this.props.taskProcessor;

        this.projectUpdated = this.projectUpdated.bind(this);
        this.boardClick = this.boardClick.bind(this);
        this.startStep = this.startStep.bind(this);
        this.finishStep = this.finishStep.bind(this);
        this.executeTask = this.executeTask.bind(this);
        this.getValidTasks = this.getValidTasks.bind(this);

    }

    //gme related functions
    projectUpdated(/*ev*/) {
        console.log('getting events:', this.client.getActiveCommitHash());
        //we are not interested in the events themselves - we assume that every major node is in place

        this.setState({
            phase: 'active',
            selected: null
        });

        this.startStep();
    }

    getValidTasks(itemId) {
        var allPossible = this.client.getPossibleTaskNames(itemId),
            valid = [],
            i;

        for (i = 0; i < allPossible.length; i += 1) {
            if (this.taskProcessor.isValid(allPossible[i], itemId)) {
                valid.push(allPossible[i]);
            }
        }

        return valid;
    }

    startStep() {
        var playerId = this.client.getActivePlayerId(),
            tasks = this.getValidTasks(playerId),
            selected = {
                id: playerId,
                tasks: tasks,
                x: 0,
                y: 0
            };

        if (this.client.getGameNode().getAttribute('isOver') === true) {
            this.setState({phase: 'finished'});
            return;
        }

        this.client.startTransaction();
        if (tasks.length === 0) {
            return;
        }

        if (tasks.length === 1) {
            this.taskProcessor[tasks[0]](playerId);
            this.setState({phase: 'inStep'});
            return;
        }

        this.setState({selected: selected, phase: 'inStep'});
    }

    finishStep() {
        var message = 'finishing step of [' + this.client.getPlayerName(this.client.getActivePlayerId()) + ']';

        this.client.makePointer(this.client.gameId, 'activePlayer',
            this.client.getPointerTarget(this.client.getActivePlayerId(), 'next'));
        this.client.completeTransaction(message);
        this.setState({selected: null, phase: 'active'});

    }

    boardClick(event) {
        if (this.client.getGameNode().getAttribute('isOver') === true) {
            return;
        }

        event.tasks = this.getValidTasks(event.id);
        if (event.tasks.length === 0) {
            if (this.client.isPiece(event.id)) {
                event.id = this.client.getNode(event.id).getParentId();
                this.boardClick(event);
            }
            return;
        }

        if (event.tasks.length === 1) {
            this.taskProcessor[event.tasks[0]](event.id);
            this.setState({phase: 'active', selected: null});
            return;
        }

        this.setState({selected: event, phase: 'active'});
    }

    executeTask(taskName) {
        console.log('taskName', taskName);
        this.taskProcessor[taskName](this.state.selected.id);
        this.setState({selected: null});
    }

    componentWillMount() {
        var UIPattern = {};

        UIPattern[this.client.gameId] = {children: 3};

        this.state = {
            phase: 'init'
        };

        this.client.addUI(this, this.projectUpdated, 'HanseaticPlayer');
        this.client.updateTerritory('HanseaticPlayer', UIPattern);
    }

    render() {
        var context = <div/>,
            endTurnButton;

        if (this.state.phase === 'init') {
            return <div>initiating...</div>;
        }
        if (this.state.selected) {
            context = <ContextMenuComponent items={this.state.selected.tasks} onSelect={this.executeTask}
                                            x={this.state.selected.x} y={this.state.selected.y}/>;
        }

        if (this.state.phase === 'finished') {
            endTurnButton = <button className="btn btn-default" disabled>EndTurn</button>;
        } else {
            endTurnButton = <button className="btn btn-default" onClick={this.finishStep}>EndTurn</button>;
        }
        return <div>
            <div className="col-sm-12">
                <HomeComponent router={this.props.router}/>
                <GameStateComponent finished={this.client.getGameNode().getAttribute('isOver')}
                                    player={this.client.getNode(this.client.getActivePlayerId()).getAttribute('name')}/>
                {endTurnButton}
            </div>
            <svg width="700" height="600">
                <BoardViewComponent client={this.client} clickEvent={this.boardClick}/>
                <DiceComponent game={this.client} type="default"
                               value={this.client.getDiceValue()}/>
            </svg>
            {context}
        </div>;
    }

}

PlayerView.propTypes = {
    client: React.PropTypes.object.isRequired,
    taskProcessor: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
};