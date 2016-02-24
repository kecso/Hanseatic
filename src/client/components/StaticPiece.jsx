'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class StaticPiece extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        var step = this.props.step,
            id = this.props.id,
            x = this.props.x,
            y = this.props.y,
            text = this.props.text,
            color = this.props.color;

        return <text key={id} id={id} fill={color} fontFamily="Lucida Console" fontSize={step*0.75}
                     x={(x*step)+step/2} y={(y*step)+(step*0.75)}
                     textAnchor="middle">{text}</text>
    }
}

StaticPiece.propTypes = {
    id: React.PropTypes.string.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    step: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired
};
