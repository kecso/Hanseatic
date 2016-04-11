'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import BoardViewComponent from '../components/boardview.jsx';

export default class PlayerView extends React.Component {
    constructor(props) {
        var UIPattern = {};

        super(props);

        this.client = this.props.client;

        this.projectUpdated = this.projectUpdated.bind(this);
        this.boardClick = this.boardClick.bind(this);

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
            commitHash: this.client.getActiveCommitHash()
        });
    }

    boardClick(event) {
        console.log(event);
    }

    render() {
        if (this.state.phase === 'init') {
            return <div/>;
        }
        return <div>
            <BoardViewComponent client={this.props.client} clickEvent={this.boardClick}/>
        </div>;
    }

}

PlayerView.propTypes = {
    client: React.PropTypes.object.isRequired,
    taskProcessor: React.PropTypes.object.isRequired
};