'use strict';
/**
 * @author kecso / https://github.com/kecso
 */


import React from 'react';

var Q = require('q');

export default class RegisterView extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormChange = this.handleFormChange.bind(this);
        this.registerNewUser = this.registerNewUser.bind(this);

        this.state = {};
    }

    handleFormChange(ev) {
        var changeObj = {};
        changeObj[ev.currentTarget.getAttribute('name')] = ev.currentTarget.value;
        this.setState(changeObj);
    }

    registerNewUser(/*ev*/) {
        var self = this,
            register = function(){
                var deferred = Q.defer();
                $.ajax({
                    url: '/rest/external/hanseatic/register',
                    data: {
                        username: self.state.username,
                        email: self.state.email,
                        password: self.state.password,
                    },
                    type: 'POST',
                    dataType: 'json',
                    statusCode: {
                        200: function () {
                            deferred.resolve();
                        },
                        401: function () {
                            deferred.reject(new Error('invalid credentials'));
                        }
                    }
                });
                return deferred.promise;
            };

        register()
        .then(function(){
            self.props.router.navigate('/rest/external/hanseatic/', {trigger: true});
        })
        .catch(function(error){
           alert(error);
        });
    }

    render() {

        return <div>
            <div className="col-sm-6">
                <form className="form-horizontal well">
                    <div className="form-group">
                        <label htmlFor="first_name" className="col-sm-5 control-label">First name:</label>
                        <div className="col-sm-7">
                            <input
                                name="first_name"
                                type="text"
                                placeholder="first name"
                                className="form-control"
                                value={this.state.first_name}
                                onChange={this.handleFormChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name" className="col-sm-5 control-label">Last name:</label>
                        <div className="col-sm-7">
                            <input
                                name="last_name"
                                type="text"
                                placeholder="last name"
                                className="form-control"
                                value={this.state.last_name}
                                onChange={this.handleFormChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username" className="col-sm-5 control-label">Username:</label>
                        <div className="col-sm-7">
                            <input
                                name="username"
                                type="text"
                                placeholder="username"
                                className="form-control"
                                value={this.state.username}
                                onChange={this.handleFormChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="col-sm-5 control-label">Password:</label>
                        <div className="col-sm-7">
                            <input
                                name="password"
                                type="password"
                                placeholder="password"
                                className="form-control"
                                value={this.state.password}
                                onChange={this.handleFormChange}
                            />
                        </div>
                    </div>
                </form>
                <button className="btn btn-default btn-md" onClick={this.registerNewUser}>
                    Register
                </button>
            </div>
        </div>;
    }

}

RegisterView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};
