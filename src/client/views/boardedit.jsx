'use strict';
/**
 * @author kecso / https://github.com/kecso
 */
import React from 'react';
import EditTile from '../components/EditTile.jsx';

export default class BoardEditView extends React.Component {
    constructor(props) {
        super(props);

        this.addTile = this.addTile.bind(this);
        this.tileUpdated = this.tileUpdated.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.setBack = this.setBack.bind(this);

        this.state = {
            tiles: this.props.tiles,
            picture: this.props.picture
        }
    }

    tileUpdated(tileNewProps) {
        var tiles = this.state.tiles;
        tiles[tileNewProps.position] = tileNewProps;
        this.setState({tiles: tiles});
    }

    save() {
        var state = this.state,
            i;
        for (i = 0; i < state.tiles.length; i += 1) {
            if (!state.tiles[i].id) {
                state.tiles[i].id = null;
            }
        }
        this.props.update(state);
    }

    cancel() {
        this.props.update(null);
    }

    setBack() {
        console.log('pop-up dialog to choose / upload a background');
    }

    addTile() {
        var tiles = this.state.tiles;

        tiles.push({
            id: null,
            x: 300,
            y: 300,
            position: tiles.length,
            width: 50,
            height: 50,
            shape: 'rect',
            color: 'red',
            isVisible: true
        });

        this.setState({tiles: tiles});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tiles: nextProps.tiles,
            picture: nextProps.picture
        });
    }

    render() {
        var tiles = [],
            i,
            tile;

        for (i = 0; i < this.state.tiles.length; i += 1) {
            tile = this.state.tiles[i];
            console.log('tile', tile.x, tile.y);
            tiles.push(<EditTile id={tile.id || ""} key={tile.id || ""} x={tile.x} y={tile.y} position={tile.position}
                                 width={tile.width} height={tile.height} shape={tile.shape} color={tile.color}
                                 isVisible={tile.isVisible} update={this.tileUpdated}/>);
        }
        return <div>
            <div>
                <button className="btn btn-default" onClick={this.addTile}>Add tile</button>
                <button className="btn btn-default disabled" onClick={this.setBack}>Set background</button>
                <button className="btn btn-warning" onClick={this.save}>Save changes</button>
                <button className="btn btn-danger" onClick={this.cancel}>Cancel</button>
            </div>
            <svg width={600} height={600}>
                <image height="600" xlinkHref={"/boards/"+this.state.picture} width="600" x="0" y="0"/>
                {tiles}
            </svg>
        </div>
    }

}

BoardEditView.propTypes = {
    tiles: React.PropTypes.array.isRequired,
    picture: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired
};