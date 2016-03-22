'use strict';
/**
 * @author kecso / https://github.com/kecso
 */
import React from 'react';
import TileEditComponent from './tileedit.jsx';
import PieceManagementComponent from './piecemanager.jsx';
import PictureSelectorComponent from './pictureselector.jsx';

export default class BoardEditComponent extends React.Component {
    constructor(props) {
        super(props);

        this.addTile = this.addTile.bind(this);
        this.tileUpdated = this.tileUpdated.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.pieceMgmnt = this.pieceMgmnt.bind(this);
        this.finishPieceManagement = this.finishPieceManagement.bind(this);
        this.boardSelection = this.boardSelection.bind(this);
        this.boardSelectionFinished = this.boardSelectionFinished.bind(this);
        this.removeTile = this.removeTile.bind(this);

        this.state = {
            phase: 'overview',
            target: null,
            tiles: this.props.tiles,
            picture: this.props.picture
        }
    }

    tileUpdated(tileNewProps) {
        var tiles = this.state.tiles,
            i;
        for (i = 0; i < tiles.length; i += 1) {
            if (tiles[i].position === tileNewProps.position) {
                tiles[i] = tileNewProps;
            }
        }
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
        delete state.phase;
        delete state.target;
        this.props.update(state);
    }

    cancel() {
        this.props.update(null);
    }

    addTile() {
        var tiles = this.state.tiles;

        tiles.push({
            id: null,
            x: 300,
            y: 300,
            position: tiles.length,
            width: 100,
            height: 100,
            shape: 'rect',
            color: 'red',
            isVisible: true
        });

        this.setState({tiles: tiles});
    }

    removeTile(tileId) {
        var tiles = this.state.tiles,
            i,
            index = -1;

        for (i = 0; i < tiles.length; i += 1) {
            if (tiles[i].id === tileId) {
                index = i;
            }
        }

        if (index !== -1) {
            tiles.splice(index, 1);
        }

        this.setState({tiles: tiles});
    }

    pieceMgmnt(tileId) {
        this.setState({phase: 'pieceManagement', target: tileId});
    }

    boardSelection() {
        this.setState({phase: 'boardSelection'});
    }

    boardSelectionFinished(selected) {
        this.setState({phase: 'overview', picture: selected});
    }

    finishPieceManagement() {
        this.setState({phase: 'overview', target: null});
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

        if (this.state.phase === 'pieceManagement') {
            return <PieceManagementComponent id={this.state.target} client={this.props.client}
                                             pictures={this.props.pieces}
                                             onFinish={this.finishPieceManagement}/>;
        } else if (this.state.phase === 'boardSelection') {
            return <PictureSelectorComponent list={this.props.boards} base="/boards/" selected={this.state.picture}
                                             onFinish={this.boardSelectionFinished}/>;
        }

        for (i = 0; i < this.state.tiles.length; i += 1) {
            tile = this.state.tiles[i];
            tiles.push(<TileEditComponent id={tile.id || ""} key={tile.position} x={tile.x} y={tile.y}
                                          position={tile.position} width={tile.width} height={tile.height}
                                          shape={tile.shape} color={tile.color} isVisible={tile.isVisible}
                                          remove={this.removeTile} update={this.tileUpdated}
                                          pieceManagement={this.pieceMgmnt}/>);
        }
        return <div>
            <div>
                <button className="btn btn-default" onClick={this.addTile}>Add tile</button>
                <button className="btn btn-default" onClick={this.boardSelection}>Set background</button>
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

BoardEditComponent.propTypes = {
    tiles: React.PropTypes.array.isRequired,
    picture: React.PropTypes.string.isRequired,
    boards: React.PropTypes.array.isRequired,
    pieces: React.PropTypes.array.isRequired,
    update: React.PropTypes.func.isRequired
};