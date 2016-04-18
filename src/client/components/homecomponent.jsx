'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class HomeComponent extends React.Component {
    constructor(props) {

        super(props);

        this.goHome = this.goHome.bind(this);
    }

    goHome() {
        this.props.router.navigate('rest/external/hanseatic/', {trigger: true});
    }

    render() {
        return <div className="btn btn-danger glyphicon glyphicon-home" onClick={this.goHome}/>;
    }

}

HomeComponent.propTypes = {
    router: React.PropTypes.object.isRequired
};