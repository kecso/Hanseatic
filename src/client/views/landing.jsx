'use strict';


import React from 'react';

export default class LandingView extends React.Component {

    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    onLogin(/*ev*/) {
        this.props.router.navigate('/rest/external/hanseatic/login', {trigger: true});
    }

    onRegister(/*ev*/) {
        this.props.router.navigate('/rest/external/hanseatic/register', {trigger: true});
    }

    render() {
        return <div>
            <button className="btn btn-default btn-lg" onClick={this.onLogin}>Login</button>
            <button className="btn btn-default btn-lg" onClick={this.onRegister}>Register</button>
        </div>;
    }
}

LandingView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};