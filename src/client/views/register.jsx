'use strict';
/**
 * @author kecso / https://github.com/kecso
 */


import React from 'react';

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
        var self = this;
        //router.put('/users/:username', function (req, res, next) {
        //    var receivedData = {
        //        userId: req.params.username,
        //        email: req.body.email,
        //        password: req.body.password,
        //        canCreate: req.body.canCreate || false,
        //        data: req.body.data || {}
        //    };
        //
        //    putUser(receivedData, req, res, next);
        //});
        $.ajax({
            url: '/api/users/'+self.state.username,
            data: {
                email: self.state.email,
                password: self.state.password,
                canCreate: true,
                data: {}
            },
            type: 'PUT',
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
