'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class PieceManagerComponent extends React.Component {
    constructor(props) {
        super(props);

        this.client = this.props.client;

        this.gatherPieceInformation = this.gatherPieceInformation.bind(this);
        this.addPiece = this.addPiece.bind(this);
        this.removePiece = this.removePiece.bind(this);
        this.setOwner = this.setOwner.bind(this);
        this.setPicture = this.setPicture.bind(this);

        this.state = {
            pieces: []
        };

    }

    gatherPieceInformation() {
        var tileNode = this.client.getNode(this.props.id),
            pieces = [],
            pieceIds = tileNode.getChildrenIds(),
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

        this.setState({pieces: pieces});
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

    setPicture(event) {
        var params = event.currentTarget.getAttribute('id').split('+');
        this.client.setAttributes(params[0], 'picture', params[1], 'change piece picture');
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
            pictureIds = ['o.png', 'x.png'],
            owners = [],
            pictures = [],
            owner;
        for (i = 0; i < this.state.pieces.length; i += 1) {
            piece = this.state.pieces[i];
            owners = [];
            for (j = 0; j < ownerIds.length; j += 1) {
                owners.push(<li key={"owner"+ownerIds[j]} id={piece.id+'+'+ownerIds[j]}
                                onClick={this.setOwner}><a>
                    {this.client.getPlayerName(ownerIds[j])}
                </a></li>)
            }
            pictures = [];
            for (j = 0; j < pictureIds.length; j += 1) {
                pictures.push(<li key={"picture"+pictureIds[j]} id={piece.id+'+'+pictureIds[j]}
                                  onClick={this.setPicture}><a>
                    {pictureIds[j]}
                </a></li>)
            }
            pieces.push(<li key={piece.id}
                            className="list-group-item">{piece.name + '[' + piece.id + ']'}
                <div className="btn-group">
                    <button className="btn btn-default dropdown-toggle" type="button"
                            id={"dropP"+piece.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {piece.picture}<span className="caret"/>
                    </button>
                    <ul className="dropdown-menu">
                        {pictures}
                    </ul>
                </div>
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
            <ul className="list-group col-sm-6">{pieces}</ul>
            <button className="btn btn-warning" onClick={this.addPiece}>AddPiece</button>
            <button className="btn btn-default" onClick={this.props.onFinish}>Finish</button>
        </div>;
    }
}

PieceManagerComponent.propTypes = {
    id: React.PropTypes.string.isRequired,
    client: React.PropTypes.object.isRequired,
    onFinish: React.PropTypes.func.isRequired
};
