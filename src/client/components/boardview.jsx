'use strict';
/**
 * @author kecso / https://github.com/kecso
 */
import React from 'react';

export default class BoardViewComponent extends React.Component {
    constructor(props) {
        super(props);

        console.log('init');
        this.client = this.props.client;

        this.buildState = this.buildState.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        this.props.clickEvent({id: event.target.getAttribute('id'), x: event.pageX, y: event.pageY});
    }

    buildState() {
        console.log('BS');
        var state = {},
            node,
            tileIds,
            pieceInfo,
            pieceIds,
            i, j;
        node = this.client.getBoardNode();

        state.background = node.getAttribute('picture');
        state.pieces = [];
        state.tiles = [];
        tileIds = this.client.getTileIds();

        for (i = 0; i < tileIds.length; i += 1) {
            node = this.client.getNode(tileIds[i]);
            if (node.getAttribute('isVisible')) {
                pieceInfo = {
                    id: tileIds[i],
                    picture: null,
                    selected: false,
                    highlighted: false,
                    x: node.getRegistry('position').x,
                    y: node.getRegistry('position').y,
                    width: node.getRegistry('measure').width,
                    height: node.getRegistry('measure').height
                };
                //first save the info to the state
                state.tiles.push(pieceInfo);

                pieceInfo = JSON.parse(JSON.stringify(pieceInfo));
                pieceInfo.x = pieceInfo.x + pieceInfo.width * 0.1;
                pieceInfo.y = pieceInfo.y + pieceInfo.height * 0.1;
                pieceInfo.width *= 0.8;
                pieceInfo.height *= 0.8;

                pieceIds = this.client.getAllPieceIdsOnTile(tileIds[i]);
                for (j = 0; j < pieceIds.length; j += 1) {
                    node = this.client.getNode(pieceIds[j]);
                    pieceInfo.id = pieceIds[j];
                    pieceInfo.picture = node.getAttribute('picture');
                    state.pieces.push(pieceInfo);
                }
            }
        }
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        console.log('getting new data:', this.client.getActiveCommitHash());
        this.buildState();
    }

    componentWillMount() {
        this.buildState();
    }

    render() {
        var tiles = [],
            pieces = [],
            item,
            i;

        for (i = 0; i < this.state.pieces.length; i += 1) {
            item = this.state.pieces[i];
            pieces.push(<image key={item.id} id={item.id} height={item.height} xlinkHref={"/pieces/"+item.picture}
                               width={item.width} x={item.x} y={item.y}/>);
        }

        for (i = 0; i < this.state.tiles.length; i += 1) {
            item = this.state.tiles[i];
            tiles.push(<rect key={item.id} id={item.id} height={item.height} width={item.width} x={item.x} y={item.y}
                             stroke="none" fill="white" fillOpacity="0.05"/>)
        }

        return <svg width={600} height={600} onClick={this.onClick}>
            <image height="600" xlinkHref={"/boards/"+this.state.background} width="600" x="0" y="0"/>
            {tiles}
            {pieces}
        </svg>
    }

}

BoardViewComponent.propTypes = {
    client: React.PropTypes.object.isRequired,
    clickEvent: React.PropTypes.func.isRequired
};