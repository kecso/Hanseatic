'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
var $ = require('jquery'),
    Q = require('q');

export default class ProfileView extends React.Component {
    constructor(props) {
        var self;
        super(props);

        self = this;

        this.onCreate = this.onCreate.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onJoin = this.onJoin.bind(this);
        this.onSeedClick = this.onSeedClick.bind(this);
        this.onStartingClick = this.onStartingClick.bind(this);
        this.initSeeds = this.initSeeds.bind(this);
        this.initStartings = this.initStartings.bind(this);

        this.state = {
            seeds: [],
            selectedSeed: null,
            startingGames: [],
            selectedStartingGame: null
        };

        $.getScript('/rest/external/hanseatic/gme', function () {
            setTimeout(function () {
                self.props.router.gme = new GME.classes.Client(GME.gmeConfig);
                self.props.router.gme.connectToDatabase(function () {
                    self.initSeeds({})
                        .then(function (state) {
                            return self.initStartings(state);
                        })
                        .then(function (state) {
                            self.setState(state);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
            }, 500);
        });
    }

    initSeeds(state) {
        var deferred = Q.defer();

        $.ajax({
            url: '/api/seeds',
            type: 'GET',
            success: function (data) {
                state.seeds = data;
                state.selectedSeed = 0;

                //self.setState(state);
                deferred.resolve(state);
            },
            error: function (error) {
                deferred.reject(error);
            }
        });

        return deferred.promise;
    }

    initStartings(state) {
        var deferred = Q.defer();

        //$.ajax({
        //    url: '/api/projects',
        //    type: 'GET',
        //    success: function (data) {
        //        var i;
        //        state.startingGames = [];
        //        for(i=0;i<data.length;i+=1){
        //            if(data[i].name.indexOf('I_') === 0){
        //                state.startingGames.push(data[i].name);
        //            }
        //        }
        //
        //        state.selectedStartingGame = 0;
        //
        //        //self.setState(state);
        //        deferred.resolve(state);
        //    },
        //    error: function (error) {
        //        deferred.reject(error);
        //    }
        //});

        this.props.router.gme.getProjects({asObject: true}, function (err, projects) {
            if (err) {
                deferred.reject(err);
            } else {
                state.startingGames = [];
                for (var i in projects) {
                    if (i.indexOf('basicGamers+I_') === 0) {
                        state.startingGames.push(projects[i].name);
                    }
                }
                state.selectedStartingGame = 0;
                deferred.resolve(state);
            }
        });

        return deferred.promise;
    }

    onCreate(/*ev*/) {
        //this.props.router.navigate('/rest/external/hanseatic', {trigger: true});
        console.log('next time :)');
    }

    onStart(/*ev*/) {
        this.props.router.navigate('/rest/external/hanseatic/initiating/' +
            this.state.seeds[this.state.selectedSeed], {trigger: true});
    }

    onJoin(/*ev*/) {
        this.props.router.navigate('/rest/external/hanseatic/initiating/' +
            this.state.seeds[this.state.selectedSeed] + '/' +
            this.state.startingGames[this.state.selectedStartingGame], {trigger: true});
    }

    onSeedClick(ev) {
        this.setState({selectedSeed: this.state.seeds.indexOf(ev.currentTarget.getAttribute('name'))});
    }

    onStartingClick(ev) {
        this.setState({selectedStartingGame: this.state.startingGames.indexOf(ev.currentTarget.getAttribute('name'))});
    }

    render() {
        var seeds = [],
            item,
            startings = [],
            className,
            i;

        for (i = 0; i < this.state.seeds.length; i++) {
            item = this.state.seeds[i];
            if (this.state.selectedSeed === i) {
                className = "btn-default btn-lg btn-primary btn-block";
            } else {
                className = "btn-default btn-lg btn-block";
            }
            seeds.push(<button key={item} name={item} className={className} onClick={this.onSeedClick}>
                <h3>{item}</h3>
            </button>);
        }

        for (i = 0; i < this.state.startingGames.length; i++) {
            item = this.state.startingGames[i];
            if (this.state.selectedStartingGame === i) {
                className = "btn-default btn-lg btn-primary btn-block";
            } else {
                className = "btn-default btn-lg btn-block";
            }
            startings.push(<button key={item} name={item} className={className} onClick={this.onStartingClick}>
                <h3>{item}</h3>
            </button>);
        }

        return <div>
            <h1>{this.props.id}</h1>
            <div className="row">
                <div className="col-xs-6">
                    <div className="pre-scrollable">{seeds}</div>
                    <button className="btn btn-default btn-xs" onClick={this.onStart}>Initiate a new game</button>
                </div>
                <div className="col-xs-6">
                    <div className="pre-scrollable">{startings}</div>
                    <button className="btn btn-default btn-xs" onClick={this.onJoin}>Join a game</button>
                </div>
            </div>
            <button className="btn btn-default btn-lg" onClick={this.onCreate}>Create</button>

        </div>;
    }
}

ProfileView.propTypes = {
    id: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};