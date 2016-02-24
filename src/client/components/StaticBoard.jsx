'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import StaticPiece from './StaticPiece.jsx';

export default class StaticBoard extends React.Component {
    constructor(props) {
        super(props);

        this.tileClick = this.tileClick.bind(this);
        this.baseClick = this.baseClick.bind(this);

        this.state = {
            currentClick: 'X',
            x: 3,
            y: 3,
            board: ['', '', '', '', '', '', '', '', '']
        }
    }

    tileClick(ev) {
        var id = ev.currentTarget.getAttribute('key');
        console.log(id + ' clicked');
    }

    baseClick(ev) {
        console.log(ev.target.getAttribute('key') + ' click');
        var id = ev.target.getAttribute('key'),
            position,
            board = this.state.board,
            currentClick;

        if(id.indexOf('tile_') !== 0){
            console.log('not tile was clicked - go on');
            return;
        }
        position = Number(id.slice(5));
        board[position] = this.state.currentClick;

        if (this.state.currentClick === 'X') {
            currentClick = 'O';
        } else {
            currentClick = 'X';
        }

        this.setState({board: board, currentClick: currentClick});
    }

    buildState() {
    }

    render() {
        var board = this.state.board,
            step = 100,
            i,
            x,
            y,
            tileId,
            tiles = [],
            pieces = [];

        for (i = 0; i < board.length; i += 1) {
            tileId = 'tile_' + i;
            y = Math.trunc(i / this.state.x);
            x = Math.trunc(i % this.state.x);
            tiles.push(<rect key={tileId} x={x*step} y={y*step} height={step} width={step}
                             stroke="black" fill="white" onClick={this.tileClick}/>);
            if (board[i]) {
                pieces.push(<StaticPiece x={x} y={y} id={'piece_'+i} text={board[i]}/>);
            }
        }

        return <svg width={this.state.x*step} height={this.state.y*step} onClick={this.baseClick}>
            {tiles}
            {pieces}
        </svg>
    }
}
