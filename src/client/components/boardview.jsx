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
        this.getMultiPieceArray = this.getMultiPieceArray.bind(this);
    }

    onClick(event) {
        this.props.clickEvent({id: event.target.getAttribute('id'), x: event.pageX, y: event.pageY});
    }

    computeSize(size) {
        var sqrt = Math.sqrt(size);

        if (Math.trunc(sqrt) * Math.trunc(sqrt) === size) {
            return Math.trunc(sqrt);
        }
        return Math.trunc(sqrt) + 1;
    }

    getMultiPieceArray(startX, startY, width, height, size) {
        var paramArray = [],
            computedSize = this.computeSize(size),
            stepX = width / computedSize,
            stepY = height / computedSize,
            x = startX,
            y = startY - stepY,
            i, j;
        for (i = 0; i < computedSize; i += 1) {
            x = startX;
            y+=stepY;
            for (j = 0; j < computedSize; j += 1) {
                paramArray.push({
                    x:x,
                    y:y,
                    width:stepX,
                    height:stepY
                });
                x+=stepX;
            }
        }
        return paramArray;
    }

    buildState() {
        var state = {},
            node,
            tileIds,
            tileInfo,
            pieceIds,
            pieceInfos,
            i, j;
        node = this.client.getBoardNode();

        state.background = node.getAttribute('picture');
        state.pieces = [];
        state.tiles = [];
        tileIds = this.client.getTileIds();

        for (i = 0; i < tileIds.length; i += 1) {
            node = this.client.getNode(tileIds[i]);
            if (node.getAttribute('isVisible')) {
                tileInfo = {
                    id: tileIds[i],
                    picture: null,
                    selected: node.getAttribute('selected'),
                    highlighted: node.getAttribute('highlighted'),
                    x: node.getRegistry('position').x,
                    y: node.getRegistry('position').y,
                    width: node.getRegistry('measure').width,
                    height: node.getRegistry('measure').height
                };
                //first save the info to the state
                state.tiles.push(tileInfo);

                pieceIds = this.client.getAllPieceIdsOnTile(tileIds[i]);
                pieceInfos = this.getMultiPieceArray(tileInfo.x + tileInfo.width * 0.1,
                    tileInfo.y + tileInfo.height * 0.1,
                0.8*tileInfo.width,0.8*tileInfo.height,pieceIds.length);

                for (j = 0; j < pieceIds.length; j += 1) {
                    node = this.client.getNode(pieceIds[j]);
                    pieceInfos[j].id = pieceIds[j];
                    pieceInfos[j].picture = node.getAttribute('picture');
                    pieceInfos[j].selected = node.getAttribute('selected');
                    pieceInfos[j].highlighted = node.getAttribute('highlighted');
                    state.pieces.push(pieceInfos[j]);
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
            if (item.highlighted) {
                pieces.push(<rect key={item.id+'_highlight'} id={item.id+'_highlight'} height={item.height}
                                  width={item.width} x={item.x} y={item.y} stroke="black" strokeWidth="3"
                                  fill="none"/>);
            }
            if (item.selected) {
                pieces.push(<rect key={item.id+'_highlight'} id={item.id+'_highlight'} height={item.height}
                                  width={item.width} x={item.x} y={item.y} stroke="nonde"
                                  fill="black" fillOpacity="0.3"/>);
            }
        }

        for (i = 0; i < this.state.tiles.length; i += 1) {
            item = this.state.tiles[i];
            tiles.push(<rect key={item.id} id={item.id} height={item.height} width={item.width} x={item.x} y={item.y}
                             stroke="none" fill="white" fillOpacity="0.05"/>);
            if (item.highlighted) {
                tiles.push(<rect key={item.id+'_highlight'} id={item.id+'_highlight'} height={item.height}
                                 width={item.width} x={item.x} y={item.y} stroke="black" strokeWidth="3"
                                 fill="none"/>);
            }
            if (item.selected) {
                pieces.push(<rect key={item.id+'_highlight'} id={item.id+'_highlight'} height={item.height}
                                  width={item.width} x={item.x} y={item.y} stroke="none"
                                  fill="black" fillOpacity="0.3"/>);
            }
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