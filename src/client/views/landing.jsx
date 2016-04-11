'use strict';

import React from 'react';

export default class LandingView extends React.Component {

    constructor(props) {
        super(props);

        var self = this;

        this.client = this.props.client;

        this.startCreator = this.startCreator.bind(this);
        this.cancelAction = this.cancelAction.bind(this);
        this.create = this.create.bind(this);
        this.startEditor = this.startEditor.bind(this);
        this.edit = this.edit.bind(this);
        this.startPlayer = this.startPlayer.bind(this);
        this.play = this.play.bind(this);
        this.startArchiver = this.startArchiver.bind(this);
        this.archiveLookup = this.archiveLookup.bind(this);

        this.state = {
            phase: 'overview',
            archives: [],
            games: []
        };

        this.client.getProjects({asObject: true}, function (err, projects) {
            //console.log(projects);
            var i,
                state = {
                    phase: 'overview',
                    archives: [],
                    games: []
                };
            for (i in projects) {
                if (projects[i].owner === 'creator') {
                    state.games.push(projects[i]);
                } else if (projects[i].owner === 'archiver') {
                    state.archives.push(projects[i]);
                }
            }
            self.setState(state);
        });
    }

    startCreator() {
        this.setState({phase: 'creator'});
    }

    create(event) {
        var self = this;
        /**
         *
         * @param {string} webgmeToken
         * @param {string} projectName - Name of new project.
         * @param {string} [ownerId] - Owner of new project, if not given falls back to user associated with the token.
         * @param {object} parameters
         * @param {string} parameters.seedName - Name of seed, file or projectId.
         * @param {string} parameters.type - 'db' or 'file'
         * @param {string} [parameters.seedBranch='master'] - If db - optional name of branch.
         * @param [function} callback
         */
        if (event.key !== 'Enter') {
            return;
        }

        this.client.seedProject({
            projectName: event.target.value,
            ownerId: 'creator',
            seedName: 'base',
            type: 'file'
        }, function (err, result) {
            if (err) {
                window.alert('Failed to create project:' + err);
                self.setState({phase: 'overview'});
            } else {
                self.props.router.navigate('rest/external/hanseatic/creator/' + result.projectId, {trigger: true});
            }
        });
    }

    startEditor() {
        this.setState({phase: 'editor'});
    }

    edit(event) {
        this.props.router.navigate('rest/external/hanseatic/creator/' +
            this.state.games[Number(event.target.getAttribute('id'))]._id, {trigger: true});
    }

    startPlayer() {
        this.setState({phase: 'player'});
    }

    play(event) {
        var self = this;
        this.client.seedProject({
            projectName: this.state.games[Number(event.target.getAttribute('id'))].name +
            '_' + Math.round(Math.random() * 10000),
            ownerId: 'player',
            seedName: this.state.games[Number(event.target.getAttribute('id'))]._id,
            type: 'db'
        }, function (err, result) {
            if (err) {
                window.alert('Failed to create project:' + err);
                self.setState({phase: 'overview'});
            } else {
                self.props.router.navigate('rest/external/hanseatic/player/' + result.projectId, {trigger: true});
            }
        });
    }

    startArchiver() {
        this.setState({phase: 'archiver'});
    }

    archiveLookup(event) {
        this.props.router.navigate('rest/external/hanseatic/archive/' +
            this.state.archives[Number(event.target.getAttribute('id'))]._id, {trigger: true});
    }

    cancelAction() {
        this.setState({phase: 'overview'});
    }

    render() {
        var items = [],
            i;

        switch (this.state.phase) {
            case'overview':
                return <div>
                    <button className="btn btn-default" onClick={this.startCreator}>Create new game</button>
                    <button className="btn btn-default" onClick={this.startEditor}>Edit your game</button>
                    <button className="btn btn-default" onClick={this.startPlayer}>Play game</button>
                    <button className="btn btn-default" onClick={this.startArchiver}>Check game archive</button>
                </div>;
            case 'creator':
                return <div>
                    <button className="btn btn-danger" onClick={this.cancelAction}>Cancel</button>
                    <button className="btn bnt-default disabled">Edit your game</button>
                    <button className="btn btn-default disabled">Play game</button>
                    <button className="btn btn-default disabled">Check game archive</button>
                    <div className="input-group">
                        <span className="input-group-addon" id="createName">NewName</span>
                        <input type="text" className="form-control" aria-describedby="createName"
                               onKeyPress={this.create}/>
                    </div>
                </div>;
            case 'editor':
                for (i = 0; i < this.state.games.length; i += 1) {
                    items.push(<a key={i} id={i} className="list-group-item"
                                  onClick={this.edit}>{this.state.games[i].name}</a>);
                }
                return <div>
                    <button className="btn btn-default disabled">Create new game</button>
                    <button className="btn btn-danger" onClick={this.cancelAction}>Cancel</button>
                    <button className="btn btn-default disabled">Play game</button>
                    <button className="btn btn-default disabled">Check game archive</button>
                    <div className="list-group">
                        {items}
                    </div>
                </div>;
            case 'player':
                for (i = 0; i < this.state.games.length; i += 1) {
                    items.push(<a key={i} id={i} className="list-group-item"
                                  onClick={this.play}>{this.state.games[i].name}</a>);
                }
                return <div>
                    <button className="btn btn-default disabled">Create new game</button>
                    <button className="btn btn-default disabled">Edit your game</button>
                    <button className="btn btn-danger" onClick={this.cancelAction}>Cancel</button>
                    <button className="btn btn-default disabled">Check game archive</button>
                    <div className="list-group">
                        {items}
                    </div>
                </div>;
            case 'archiver':
                for (i = 0; i < this.state.archives.length; i += 1) {
                    items.push(<a key={i} id={i} className="list-group-item"
                                  onClick={this.archiveLookup}>{this.state.archives[i].name}</a>);
                }
                return <div>
                    <button className="btn btn-default disabled">Create new game</button>
                    <button className="btn btn-default disabled">Edit your game</button>
                    <button className="btn btn-default disabled">Play game</button>
                    <button className="btn btn-danger" onClick={this.cancelAction}>Cancel</button>
                    <div className="list-group">
                        {items}
                    </div>
                </div>;
        }
    }
}
LandingView.propTypes = {
    router: React.PropTypes.object.isRequired,
    client: React.PropTypes.object.isRequired
};