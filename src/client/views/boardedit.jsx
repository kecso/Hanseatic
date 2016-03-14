'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

/*
 board:[''/'p1'/'p2'...]
 */
import React from 'react';
import EditTile from '../components/EditTile.jsx';

export default class BoardEditView extends React.Component {
    constructor(props) {
        var self;

        super(props);

        this.addTile = this.addTile.bind(this);
        this.tileUpdated = this.tileUpdated.bind(this);
        this.save = this.save.bind(this);
        this.setBack = this.setBack.bind(this);

        self = this;

        self.state = {
            tiles: [
                {
                    id: 'testOne',
                    x: 100,
                    y: 100,
                    position: 0,
                    width: 100,
                    height: 100,
                    shape: 'rect',
                    color: 'red'
                },
                {
                    id: 'testTwo',
                    x: 200,
                    y: 100,
                    position: 1,
                    width: 100,
                    height: 100,
                    shape: 'rect',
                    color: 'red'
                },
                {
                    id: 'testThree',
                    x: 300,
                    y: 100,
                    position: 2,
                    width: 100,
                    height: 100,
                    shape: 'rect',
                    color: 'red'
                }
            ]
        }
    }

    tileUpdated(tileNewProps) {
        var tiles = this.state.tiles;
        tiles[tileNewProps.position] = tileNewProps;
        this.setState({tiles: tiles});
    }

    save() {
        console.log('we will save the model');
    }

    setBack() {
        console.log('pop-up dialog to choose / upload a background');
    }

    addTile() {
        var tiles = this.state.tiles;

        tiles.push({
            id: 'testTile' + tiles.length,
            x: 300,
            y: 300,
            position: tiles.length,
            width: 50,
            height: 50,
            shape: 'rect',
            color: 'red'
        });

        this.setState({tiles: tiles});
    }

    render() {
        var tiles = [],
            i,
            tile;

        for (i = 0; i < this.state.tiles.length; i += 1) {
            tile = this.state.tiles[i];
            tiles.push(<EditTile id={tile.id} x={tile.x} y={tile.y} position={tile.position}
                                 width={tile.width} height={tile.height} shape={tile.shape} color={tile.color}
                                 update={this.tileUpdated}/>);
        }
        return <div>
            <div>
                <button className="btn btn-default" onClick={this.addTile}>Add tile</button>
                <button className="btn btn-default" onClick={this.setBack}>Set background</button>
                <button className="btn btn-danger" onClick={this.save}>Save changes</button>
            </div>
            <svg width={600} height={600}>
                <image height="600" xlinkHref="/boards/ludo_big.png" width="600" x="0" y="0"/>
                {tiles}
            </svg>
        </div>
    }

}