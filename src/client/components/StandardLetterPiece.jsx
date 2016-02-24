'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
var $ = require('jquery'),
    Q = require('q');

export default class StandardLetterPiece extends React.Component {
    constructor(props) {
        super(props);

        this.buildState = this.buildState.bind(this);
        this.pieceClick = this.pieceClick.bind(this);

        this.props.hGame.subscribe('StandardLetterPiece' + this.props.nodeId, this.buildState());
    }

    pieceClick(/*ev*/) {
        console.log('piece cliecked:', this.props.nodeId);
        this.props.hGame.click(this.props.nodeId);
    }

    buildState() {
        this.setState({
            x: this.props.hGame.getPiecePositionX(this.props.nodeId),
            y: this.props.hGame.getPiecePositionY(this.props.nodeId),
            text: this.props.hGame.getPieceText(this.props.nodeId)
        });
    }

    render() {
        return <text id={this.props.nodeId} x={this.state.x*this.props.step+this.props.steps/2}
                     y={this.state.y*this.props.step+80} text-anchor="middle"
                     onClick={this.pieceClick}>{this.state.text}</text>;
    }
}

StandardLetterPiece.propTypes = {
    nodeId: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired,
    hGame: React.PropTypes.object.isRequired
};