'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
var $ = require('jquery'),
    Q = require('q'),
    organizationId = 'basicGamers',
    gmeClient,
    GUID = require('webgme/src/common/util/guid');

export default class InitiatingView extends React.Component {
    constructor(props) {
        var self;

        gmeClient = new GME.classes.Client(GME.gmeConfig);

        super(props);

        self = this;

        //this.onCreate = this.onCreate.bind(this);
        this.openUp = this.openUp.bind(this);

        this.projectChanged = this.projectChanged.bind(this);
        this.state = {
            userId: gmeClient.getUserId(),
            gameId: props.id
        };

        if (!self.state.gameId) {
            //we are the game creators
            self.state.gameId = 'I_' + self.props.seed + '_' + GUID().substring(0, 8);
            $.ajax({
                url: '/api/projects/' + organizationId + '/' + self.state.gameId,
                type: 'PUT',
                data: {
                    type: 'file',
                    seedName: self.props.seed
                },
                success: function (data) {
                    self.openUp()
                },
                error: function (error) {
                    console.log('fuck', error);
                }
            });
        } else {
            self.openUp();
        }

    }

    openUp() {
        //now we connect through socket.io and start listening to the changes of the project
        var self = this;
        Q.nfcall(gmeClient.connectToDatabase)
            .then(function () {
                return Q.nfcall(gmeClient.selectProject, organizationId + '+' + self.state.gameId, 'master');
            })
            .then(function () {
                gmeClient.addUI(self, self.projectChanged, 'HanseaticYeah');
                gmeClient.updateTerritory('HanseaticYeah', {'': {children: 2}});
            })
            .catch(function (error) {
                console.log('cannot connect :/ ', error);
            });
    }

    projectChanged(events) {
        //this is the main event handling function
        console.log('yeah, we got events', events);
    }

    render() {
        return <div>
            <h1>{this.state.gameId + ':' + this.state}</h1>
        </div>;
    }
}

InitiatingView.propTypes = {
    id: React.PropTypes.string.isRequired,
    seed: React.PropTypes.string.isRequired,
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};