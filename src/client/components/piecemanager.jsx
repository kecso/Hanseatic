'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class PieceManagerComponent extends React.Component {
    constructor(props) {
        super(props);

        this.gme = this.props.gmeClient;

        this.gatherPieceInformation = this.gatherPieceInformation.bind(this);
        this.addPiece = this.addPiece.bind(this);
        this.getMetaId = this.getMetaId.bind(this);
        this.removePiece = this.removePiece.bind(this);
        this.getPlayerIds = this.getPlayerIds.bind(this);
        this.getPlayerName = this.getPlayerName.bind(this);
        this.setOwner = this.setOwner.bind(this);
        this.setPicture = this.setPicture.bind(this);

        this.state = {
            pieces: []
        };

    }

    gatherPieceInformation() {
        var tileNode = this.gme.getNode(this.props.id),
            pieces = [],
            pieceIds = tileNode.getChildrenIds(),
            pieceNode,
            i;

        for (i = 0; i < pieceIds.length; i += 1) {
            pieceNode = this.gme.getNode(pieceIds[i]);
            pieces.push({
                id: pieceIds[i],
                name: pieceNode.getAttribute('name'),
                picture: pieceNode.getAttribute('picture'),
                owner: pieceNode.getPointer('owner').to
            });
        }

        this.setState({pieces: pieces});
    }

    //TODO should be refactored to some common library place
    getMetaId(name) {
        var metaNodes = this.gme.getAllMetaNodes(),
            i;
        for (i = 0; i < metaNodes.length; i += 1) {
            if (metaNodes[i].getAttribute('name') === name) {
                return metaNodes[i].getId();
            }
        }

        return null;
    }

    getPlayerIds() {
        var playerIds = [],
            gameNode = this.gme.getNode('/W'),
            player = gameNode === null ? null : this.gme.getNode(gameNode.getPointer('activePlayer').to),
            notFinished = true;

        while (player && notFinished) {
            if (playerIds.indexOf(player.getId()) === -1) {
                playerIds.push(player.getId());
                player = this.gme.getNode(player.getPointer('next').to);
            } else {
                notFinished = false;
            }
        }

        return playerIds;
    }

    getPlayerName(playerId) {
        return this.gme.getNode(playerId).getAttribute('name');
    }

    addPiece() {
        var baseId = this.getMetaId('Piece'),
            gameNode = this.gme.getNode('/W'),
            activePlayer = gameNode.getPointer('activePlayer').to,
            tileNode = this.gme.getNode(this.props.id),
            parameters = {parentId: this.props.id},
            result;
        parameters[baseId] = {};

        this.gme.startTransaction('adding new piece to tile:', this.props.id);
        result = this.gme.createChildren(parameters);
        result = result[baseId];
        this.gme.setAttributes(result, 'picture', 'o.png');
        this.gme.makePointer(result, 'owner', activePlayer);
        this.gme.completeTransaction();
    }

    removePiece(event) {
        this.gme.delMoreNodes([event.target.getAttribute('id')]);
    }

    setOwner(event) {
        var params = event.currentTarget.getAttribute('id').split('+');
        this.gme.makePointer(params[0], 'owner', params[1], 'change piece owner');
    }

    setPicture(event) {
        var params = event.currentTarget.getAttribute('id').split('+');
        this.gme.setAttributes(params[0], 'picture', params[1], 'change piece picture');
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
            ownerIds = this.getPlayerIds(),
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
                    {this.getPlayerName(ownerIds[j])}
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
                        {this.getPlayerName(piece.owner)}<span className="caret"/>
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
    gmeClient: React.PropTypes.object.isRequired,
    onFinish: React.PropTypes.func.isRequired
};
