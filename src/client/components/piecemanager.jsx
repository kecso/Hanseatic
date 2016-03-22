'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';
import PictureSelectorComponent from './pictureselector.jsx';

export default class PieceManagerComponent extends React.Component {
    constructor(props) {
        super(props);

        this.client = this.props.client;

        this.gatherPieceInformation = this.gatherPieceInformation.bind(this);
        this.addPiece = this.addPiece.bind(this);
        this.removePiece = this.removePiece.bind(this);
        this.setOwner = this.setOwner.bind(this);
        this.selectPicture = this.selectPicture.bind(this);
        this.selectPictureFinished = this.selectPictureFinished.bind(this);

        this.state = {
            phase: 'overview',
            target: null,
            pieces: []
        };

    }

    gatherPieceInformation() {
        var pieces = [],
            pieceIds = this.client.getAllPieceIdsOnTile(this.props.id),
            pieceNode,
            i;

        for (i = 0; i < pieceIds.length; i += 1) {
            pieceNode = this.client.getNode(pieceIds[i]);
            pieces.push({
                id: pieceIds[i],
                name: pieceNode.getAttribute('name'),
                picture: pieceNode.getAttribute('picture'),
                owner: pieceNode.getPointer('owner').to
            });
        }

        this.setState({target: null, phase: 'overview', pieces: pieces});
    }

    addPiece() {
        var baseId = this.client.getMetaId('Piece'),
            activePlayer = this.client.getPointerTarget(this.client.gameId, 'activePlayer'),
            parameters = {parentId: this.props.id},
            result;
        parameters[baseId] = {};

        this.client.startTransaction('adding new piece to tile:', this.props.id);
        result = this.client.createChildren(parameters);
        result = result[baseId];
        this.client.setAttributes(result, 'picture', 'o.png');
        this.client.makePointer(result, 'owner', activePlayer);
        this.client.completeTransaction();
    }

    removePiece(event) {
        this.client.delMoreNodes([event.target.getAttribute('id')]);
    }

    setOwner(event) {
        var params = event.currentTarget.getAttribute('id').split('+');
        this.client.makePointer(params[0], 'owner', params[1], 'change piece owner');
    }

    selectPicture(event) {
        this.setState({phase: 'pictureSelection', target: event.currentTarget.getAttribute('id')});
    }

    selectPictureFinished(selected) {
        this.client.setAttributes(this.state.target, 'picture', selected);
    }

    componentWillReceiveProps(/*nextProps*/) {
        this.gatherPieceInformation();
    }

    componentWillMount() {
        this.gatherPieceInformation();
    }

    render() {
        var pieces = [],
            piece, i, j,
            ownerIds = this.client.getPlayerIds(),
            owners = [],
            owner;

        if (this.state.phase === 'pictureSelection') {
            return <PictureSelectorComponent list={this.props.pictures} base="/pieces/"
                                             onFinish={this.selectPictureFinished}/>
        }

        for (i = 0; i < this.state.pieces.length; i += 1) {
            piece = this.state.pieces[i];
            owners = [];
            for (j = 0; j < ownerIds.length; j += 1) {
                owners.push(<li key={"owner"+ownerIds[j]} id={piece.id+'+'+ownerIds[j]}
                                onClick={this.setOwner}><a>
                    {this.client.getPlayerName(ownerIds[j])}
                </a></li>)
            }
            pieces.push(<li key={piece.id}
                            className="list-group-item">
                <svg id={piece.id} height="25" width="25" onClick={this.selectPicture}>
                    <image height="25" xlinkHref={"/pieces/"+piece.picture} width="25"/>
                </svg>
                {piece.name + '[' + piece.id + ']'}
                <div className="btn-group">
                    <button className="btn btn-warning dropdown-toggle" type="button"
                            id={"dropO"+piece.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.client.getPlayerName(piece.owner)}<span className="caret"/>
                    </button>
                    <ul className="dropdown-menu">
                        {owners}
                    </ul>
                </div>
                <span className="glyphicon glyphicon-remove" id={piece.id} onClick={this.removePiece}/>
            </li>);
        }
        return <div>
            <h3>Piece Management for Tile [{this.props.id}]</h3>
            <button className="btn btn-warning" onClick={this.addPiece}>AddPiece</button>
            <button className="btn btn-default" onClick={this.props.onFinish}>Finish</button>
            <ul className="list-group col-sm-6">{pieces}</ul>
        </div>;
    }
}

PieceManagerComponent
    .propTypes = {
    id: React.PropTypes.string.isRequired,
    client: React.PropTypes.object.isRequired,
    pictures: React.PropTypes.array.isRequired,
    onFinish: React.PropTypes.func.isRequired
};
