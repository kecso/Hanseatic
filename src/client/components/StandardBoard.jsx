'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import StaticPiece from './StaticPiece.jsx';
var $ = require('jquery'),
    Q = require('q');

export default class StandardBoard extends React.Component {
    constructor(props) {
        var self;

        super(props);

        self = this;

        //binding
        self.onClick = self.onClick.bind(this);
        self.update = self.update.bind(this);

        self.props.game.subscribe(self.update);
        self.state = {
            board: self.props.game.getStringBoard(),
            tileIds: self.props.game.getTileIds(),
            activePlayer: self.props.game.getActivePlayerName()
        };
    }

    update() {
        var state = {};

        if (this.props.game.isOngoing() && this.props.game.isEnding()) {
            return;
        }
        state.board = this.props.game.getStringBoard();
        state.tileIds = this.props.game.getTileIds();
        state.activePlayer = this.props.game.getActivePlayerName();
        this.setState(state);
    }

    onClick(ev) {
        //myTurn check comes later, now everybody just can step...
        var self = this,
            target = ev.target.getAttribute('id');
        console.log(target + ' click');
        if (target.indexOf('piece') === 0) {
            //do nothing
        } else {
            self.props.game.pressed(target);
        }

    }

    render() {
        var board = this.state.board,
            step = this.props.step,
            i, x, y,
            tileIds = this.state.tileIds,
            tiles = [],
            pieces = [],
            infoTxt = '',
            clickFunction = this.onClick;

        if (!this.props.game.isOngoing()) {
            clickFunction = function (ev) {
                console.log('game finished, go home!')
            };
            infoTxt += 'game is ended ';
            i = this.props.game.getWinnerName();
            if (i) {
                infoTxt += ' and [' + i + '] won! -(]:-)';
            } else {
                infoTxt += 'in a tie! :)';
            }
        } else {
            infoTxt = 'player [' + this.props.game.getActivePlayerName() + '] moves!';
        }

        for (i = 0; i < board.length; i += 1) {
            y = Math.trunc(i / this.props.x);
            x = Math.trunc(i % this.props.x);
            tiles.push(<rect key={tileIds[i]} id={tileIds[i]} x={x*step} y={y*step} height={step} width={step}
                             stroke="black" fill="white" onClick={this.tileClick}/>);
            if (board[i]) {
                pieces.push(<StaticPiece key={'piece_'+i} x={x} y={y} id={'piece_'+i} text={board[i]} color={"red"}
                                         step={step}/>);
            }
        }

        return <div>
            <label>{infoTxt}</label><br/>
            <svg width={this.props.x*step} height={this.props.y*step} onClick={clickFunction}>
                {tiles}
                {pieces}
            </svg>
        </div>
    }
}

StandardBoard.propTypes = {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    step: React.PropTypes.number.isRequired,
    game: React.PropTypes.object.isRequired
};