'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class TileEditComponent extends React.Component {
    constructor(props) {
        super(props);

        this.startMove = this.startMove.bind(this);
        this.startResize = this.startResize.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.startPieceMgmnt = this.startPieceMgmnt.bind(this);
        this.changeVisibility = this.changeVisibility.bind(this);
        this.deleteTile = this.deleteTile.bind(this);

        this.state = {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            resize: false,
            position: false,
            positionX: 0,
            positionY: 0,
            isVisible: this.props.isVisible
        };
    }

    startMove(event) {
        this.setState({position: true, positionX: event.clientX, positionY: event.clientY});
    }

    startResize(event) {
        this.setState({resize: true, positionX: event.clientX, positionY: event.clientY});
    }

    onMouseUp(event) {
        if (this.state.position || this.state.resize) {
            this.props.update({
                id: this.props.id,
                x: this.state.x,
                y: this.state.y,
                position: this.props.position,
                width: this.state.width,
                height: this.state.height,
                shape: this.props.shape,
                color: this.props.color,
                isVisible: this.state.isVisible
            });
        }
        this.setState({position: false, resize: false, positionX: 0, positionY: 0});
    }

    onMouseMove(event) {
        if (this.state.position) {
            var newX, newY;
            newX = this.state.x + (event.clientX - this.state.positionX);
            newY = this.state.y + (event.clientY - this.state.positionY);

            this.setState({x: newX, y: newY, positionX: event.clientX, positionY: event.clientY});
        } else if (this.state.resize) {
            var newWidth, newHeight;
            newWidth = this.state.width + (event.clientX - this.state.positionX);
            newHeight = this.state.height + (event.clientY - this.state.positionY);
            this.setState({width: newWidth, height: newHeight, positionX: event.clientX, positionY: event.clientY});
        }
    }

    onMouseLeave(event) {
        this.setState({position: false, resize: false, positionX: 0, positionY: 0});
    }

    startPieceMgmnt(/*event*/) {
        this.props.pieceManagement(this.props.id);
    }

    changeVisibility() {
        this.props.update({
            id: this.props.id,
            x: this.state.x,
            y: this.state.y,
            position: this.props.position,
            width: this.state.width,
            height: this.state.height,
            shape: this.props.shape,
            color: this.props.color,
            isVisible: this.state.isVisible !== true
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            x: nextProps.x,
            y: nextProps.y,
            width: nextProps.width,
            height: nextProps.height,
            resize: false,
            position: false,
            positionX: 0,
            positionY: 0,
            isVisible: nextProps.isVisible
        });
    }

    deleteTile() {
        this.props.remove(this.props.id);
    }

    render() {
        var visibility;

        if (this.state.isVisible) {
            visibility = <image height="20" xlinkHref="/icons/visible.svg"
                                width="20" x="40" y="0" onMouseDown={this.changeVisibility}/>;
        } else {
            visibility = <image height="20" xlinkHref="/icons/invisible.svg"
                                width="20" x="40" y="0" onMouseDown={this.changeVisibility}/>;
        }
        if (this.props.shape === 'rect') {
            return <svg height={this.state.height} width={this.state.width} x={this.state.x} y={this.state.y}
                        onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseLeave} onMouseMove={this.onMouseMove}>
                <rect height={this.state.height} width={this.state.width} x="0" y="0" stroke="black" strokeWidth="3"
                      fill="none"/>
                <text className="diasbled" x={this.state.width/2} y={this.state.height/2}
                      textAnchor="middle">{this.props.position}</text>
                <image height="20" xlinkHref="/icons/move.svg"
                       width="20" x="0" y="0" onMouseDown={this.startMove}/>
                <image height="20" xlinkHref="/icons/details.svg"
                       width="20" x="20" y="0" onMouseDown={this.startPieceMgmnt}/>
                {visibility}
                <image height="20" xlinkHref="/icons/delete.svg"
                       width="20" x="60" y="0" onMouseDown={this.deleteTile}/>
                <image height="20" xlinkHref="/icons/resize.svg" width="20" x={this.state.width-20}
                       y={this.state.height-20} onMouseDown={this.startResize}/>
            </svg>;

        } else {
            console.log('shape is not supported');
        }

    }
}

TileEditComponent.propTypes = {
    id: React.PropTypes.string.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    shape: React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired,
    isVisible: React.PropTypes.bool.isRequired,
    update: React.PropTypes.func.isRequired,
    remove: React.PropTypes.func.isRequired,
    pieceManagement: React.PropTypes.func.isRequired
};
