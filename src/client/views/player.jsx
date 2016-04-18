'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import BoardViewComponent from '../components/boardview.jsx';
import GameStateComponent from '../components/gamestate.jsx';
import ContextMenuComponent from '../components/contextmenu.jsx';
import HomeComponent from '../components/homecomponent.jsx';

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
        this.client.startTransaction();
    }

    finishStep() {
        var message = 'finishing step of [' + this.client.getPlayerName(this.client.getActivePlayerId()) + ']';

        this.client.makePointer(this.client.gameId, 'activePlayer',
            this.client.getPointerTarget(this.client.getActivePlayerId(), 'next'));
        this.client.completeTransaction(message);

    }

    boardClick(event) {
        event.tasks = this.getValidTasks(event.id);
        this.setState({selected: event});
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
        var context = <div/>;

        if (this.state.phase === 'init') {
            return <div>initiating...</div>;
        }
        if (this.state.selected) {
            context = <ContextMenuComponent items={this.state.selected.tasks} onSelect={this.executeTask}
                                            x={this.state.selected.x} y={this.state.selected.y}/>;
        }
        return <div>
            <div className="col-sm-12">
                <HomeComponent router={this.props.router}/>
                <GameStateComponent finished={this.client.getGameNode().getAttribute('isOver')}
                                    player={this.client.getNode(this.client.getActivePlayerId()).getAttribute('name')}/>
                <button className="btn btn-default" onClick={this.finishStep}>EndTurn</button>
            </div>
            <BoardViewComponent client={this.client} clickEvent={this.boardClick}/>
            {context}
        </div>;
    }

}

PlayerView.propTypes = {
    client: React.PropTypes.object.isRequired,
    taskProcessor: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
};