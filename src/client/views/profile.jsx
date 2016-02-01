'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
export default class ProfileView extends React.Component {
    constructor(props) {
        var self;
        super(props);

        self = this;

        this.onCreate = this.onCreate.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onSeedClick = this.onSeedClick.bind(this);
        this.state = {
            seeds: [],
            selectedSeed: null
        };

        $.ajax({
            url: '/api/seeds',
            type: 'GET',
            success: function (data) {
                console.log('data', data);
                self.state.seeds = data;
                self.state.selectedSeed = 0;

                self.setState(self.state);
            },
            error: function (error) {
                console.log('fuck', error);
            }
        });
    }

    onCreate(/*ev*/) {
        //this.props.router.navigate('/rest/external/hanseatic', {trigger: true});
    }

    onStart(/*ev*/) {
        //this.props.router.navigate('/register', {trigger: true});
        console.log('almost', this.state.seeds[this.state.selectedSeed]);
    }

    onSeedClick(ev) {
        this.setState({selectedSeed: this.state.seeds.indexOf(ev.currentTarget.getAttribute('name'))});
    }

    render() {
        var seeds = [],
            seed,
            className,
            i;

        for (i = 0; i < this.state.seeds.length; i++) {
            seed = this.state.seeds[i];
            if (this.state.selectedSeed === i) {
                className = "btn-default btn-lg btn-primary btn-block";
            } else {
                className = "btn-default btn-lg btn-block";
            }
            seeds.push(<button key={seed} name={seed} className={className} onClick={this.onSeedClick}>
                <h3>{seed}</h3>
            </button>);
        }
        return <div>
            <h1>{this.props.id}</h1>
            <div className="pre-scrollable">{seeds}</div>
            <button className="btn btn-default btn-lg" onClick={this.onCreate}>Create</button>
            <button className="btn btn-default btn-lg" onClick={this.onStart}>Start</button>
        </div>;
    }
}
ProfileView.propTypes = {
    id: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};