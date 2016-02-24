'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

/*
 board:[''/'p1'/'p2'...]
 */
import React from 'react';
import StaticBoard from '../components/StaticBoard.jsx';

export default class StaticView extends React.Component {
    constructor(props) {
        var self;

        super(props);

        self = this;

    }

    render() {
        return <div>
            <StaticBoard />
            </div>
    }

}