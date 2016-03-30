'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import BoardViewComponent from '../components/boardview.jsx';

export default class ArchiveView extends React.Component {
    constructor(props) {
        var UIPattern = {};

        super(props);

        this.client = this.props.client;

        this.projectUpdated = this.projectUpdated.bind(this);
        this.boardClick = this.boardClick.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);

        UIPattern[this.client.gameId] = {children: 3};

        this.state = {
            phase: 'init',
            commitHash: this.client.getActiveCommitHash()
        };

        this.client.addUI(this, this.projectUpdated, 'HanseaticArchive');
        this.client.updateTerritory('HanseaticArchive', UIPattern);
    }

    //gme related functions
    projectUpdated(/*ev*/) {
        console.log('getting events:', this.client.getActiveCommitHash());
        //we are not interested in the events themselves - we assume that every major node is in place

        this.setState({
            phase: 'active',
            commitHash: this.client.getActiveCommitHash(),
            index: this.props.history.indexOf(this.client.getActiveCommitHash())
        });
    }

    boardClick(event) {
        console.log(event);
    }

    next() {
        if (this.props.history[this.state.index - 1]) {
            console.log('upcoming commit:', this.props.history[this.state.index - 1]);
            this.client.selectCommit(this.props.history[this.state.index - 1], function (err) {
                console.log('selecting finished');
            });
        } else {
            console.log('no more moves');
        }
    }

    previous() {
        if (this.props.history[this.state.index + 1]) {
            console.log('upcoming commit:', this.props.history[this.state.index + 1]);
            this.client.selectCommit(this.props.history[this.state.index + 1], function (err) {
                console.log('selecting finished');
            });
        } else {
            console.log('already at first move');
        }
    }

    render() {
        if (this.state.phase === 'init') {
            return <div/>;
        }
        return <div>
            <button className="btn btn-default" onClick={this.previous}>Previous</button>
            <button className="btn btn-default" onClick={this.next}>Next</button>
            <BoardViewComponent client={this.props.client} clickEvent={this.boardClick}/>
        </div>;
    }

}

ArchiveView.propTypes = {
    client: React.PropTypes.object.isRequired,
    history: React.PropTypes.array.isRequired
};