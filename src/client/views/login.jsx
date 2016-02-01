'use strict';

import React from 'react';

export default class LoginView extends React.Component {
    constructor(props) {
        console.log('init login view');
        super(props);
        this.state = {username: '', password: ''};
        this.handleFormChange = this.handleFormChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    handleFormChange(ev) {
        switch (ev.target.getAttribute('name')) {
            case 'username':
                this.setState({username: ev.target.value});
                break;
            case 'password':
                this.setState({password: ev.target.value});
                break;
        }
    }

    onLogin(ev) {
        var self = this;

        ev.preventDefault();
        ev.stopPropagation();
        $.ajax({
            url: '/rest/external/hanseatic/login',
            data: self.state,
            type: 'POST',
            dataType: 'json',
            //success: function () {
            //    console.log('success');
            //    //we are logged, we can go to the profile page
            //    self.props.router.navigate('/rest/external/hanseatic/profile/' + self.state.username, {trigger: true});
            //},
            //error: function (error) {
            //    console.log(error);
            //    alert('invalid credentials, please try again!');
            //}
            statusCode: {
                200: function () {
                    self.props.router.navigate('/rest/external/hanseatic/profile/' + self.state.username, {trigger: true});
                },
                401: function () {
                    alert('invalid credentials, please try again!');
                }
            }
        });
    }

    render() {
        return <form className="form-horizontal well">
            <div className="form-group">
                <label htmlFor="username" className="col-sm-3 control-label">Username:</label>
                <div className="col-sm-3">
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="form-control"
                        value={this.state.username}
                        onChange={this.handleFormChange}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="password" className="col-sm-3 control-label">Password:</label>
                <div className="col-sm-3">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="form-control"
                        value={this.state.password}
                        onChange={this.handleFormChange}
                    />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-3">
                    <button className="btn btn-primary" onClick={this.onLogin}>Login</button>
                </div>
            </div>
        </form>;
    }
}

LoginView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};