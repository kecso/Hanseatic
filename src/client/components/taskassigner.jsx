'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class TaskAssignerComponent extends React.Component {
    constructor(props) {

        super(props);
        this.client = this.props.client;

        this.state = {
            target: null,
            allTasks: [],
            allTiles: [],
            allPlayers: []
        };

        this.buildLists = this.buildLists.bind(this);
        this.addTask = this.addTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.setTarget = this.setTarget.bind(this);
    }

    buildLists() {
        //now we collect the lists - we are not dealing with the target
        var newState = {
            allTasks: this.client.getTaskIds(),
            allTiles: this.client.getTileIds(),
            allPlayers: this.client.getPlayerIds()
        };

        this.setState(newState);
    }

    componentWillMount() {
        this.buildLists();
    }

    componentWillReceiveProps(newProps) {
        this.client = newProps.client;
        this.buildLists();
    }

    addTask(event) {
        //addMember(path, memberpath, setid, msg)
        this.client.addMember(this.state.target, event.currentTarget.getAttribute('id'), 'possibleTasks',
            'assign: [' + event.currentTarget.getAttribute('id') + '] task to item [' + this.state.target + ']');
    }

    removeTask(event) {
        //emoveMember(path, memberpath, setid, msg)
        this.client.removeMember(this.state.target, event.currentTarget.getAttribute('id'), 'possibleTasks',
            'unassign: [' + event.currentTarget.getAttribute('id') + '] task to item [' + this.state.target + ']');
    }

    setTarget(event) {
        this.setState({target: event.currentTarget.getAttribute('id')});
    }

    render() {
        var targets = [],
            notAssigned = [],
            assigned = [],
            assignedIds = [],
            premise,
            pieceIds, i, j;

        for (i = 0; i < this.state.allPlayers.length; i += 1) {
            targets.push(<li key={this.state.allPlayers[i]}>
                <a id={this.state.allPlayers[i]} onClick={this.setTarget}>
                    {this.client.getPlayerName(this.state.allPlayers[i])}</a>
            </li>);
        }
        targets.push(<li key="sep_players" role="separator" className="divider"></li>);
        for (i = 0; i < this.state.allTiles.length; i += 1) {
            targets.push(<li key={this.state.allTiles[i]}>
                <a id={this.state.allTiles[i]} onClick={this.setTarget}>
                    {this.client.getNode(this.state.allTiles[i]).getAttribute('name') +
                    '[' + this.state.allTiles[i] + ']'}
                </a></li>);
            pieceIds = this.client.getAllPieceIdsOnTile(this.state.allTiles[i]);
            for (j = 0; j < pieceIds.length; j += 1) {
                targets.push(<li key={pieceIds[j]}>
                    <a id={pieceIds[j]} onClick={this.setTarget}>
                        <span className="glyphicon glyphicon-pawn"></span>
                        {this.client.getNode(pieceIds[j]).getAttribute('name') + '[' + pieceIds[j] + ']'}
                    </a></li>);
            }
        }

        if (this.state.target) {
            assignedIds = this.client.getTasksOfElement(this.state.target);
            for (i = 0; i < this.state.allTasks.length; i += 1) {
                premise = this.client.getPointerTarget(this.state.allTasks[i], 'premise');
                if (premise) {
                    premise = <span className="badge">{this.client.getNode(premise).getAttribute('name')}</span>
                } else {
                    premise = <span></span>;
                }
                if (assignedIds.indexOf(this.state.allTasks[i]) === -1) {
                    notAssigned.push(<button key={this.state.allTasks[i]} id={this.state.allTasks[i]}
                                             className="btn-btn btn-default btn-block" onClick={this.addTask}>
                        {this.client.getNode(this.state.allTasks[i]).getAttribute('name')}
                        {premise}
                        <span className="glyphicon glyphicon-arrow-right"/>
                    </button>);
                } else {
                    assigned.push(<button key={this.state.allTasks[i]} id={this.state.allTasks[i]}
                                          className="btn-btn btn-default btn-block" onClick={this.removeTask}>
                        <span className="glyphicon glyphicon-arrow-left"/>
                        {this.client.getNode(this.state.allTasks[i]).getAttribute('name')}
                        {premise}
                    </button>);
                }
            }
        }

        return <div>
            <div className="col-sm-12">
                <div className="col-sm-6">
                    <label className="col-sm-6">Assign the tasks of:</label>
                    <div className="col-sm-6">
                        <button className="btn btn-default btn-block dropdown-toggle" type="button" id="targetDropdown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.target === null ? '-none-' :
                                this.client.getNode(this.state.target).getAttribute('name')}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="targetDropdown">
                            {targets}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="col-sm-6">
                    <label>Assign task to item</label>
                    {notAssigned}
                </div>
                <div className="col-sm-6">
                    <label>Remove task from item</label>
                    {assigned}
                </div>
            </div>
            <button className="btn btn-default btn-lg" onClick={this.props.onFinish}>BackToOverview</button>
        </div>
    }

}
TaskAssignerComponent.propTypes = {
    client: React.PropTypes.object.isRequired,
    onFinish: React.PropTypes.func.isRequired

};