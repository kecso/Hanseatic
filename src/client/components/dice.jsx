'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class DiceComponent extends React.Component {
    constructor(props) {

        super(props);

        this.roll = this.roll.bind(this);

        this.state = {
            type: this.props.type || 'default',
            value: this.props.game.getDiceValue()
        };
    }

    roll() {
        this.props.game.roll();
        this.setState({
            type: this.props.type || 'default',
            value: this.props.game.getDiceValue()
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            type: this.props.type || 'default',
            value: this.props.game.getDiceValue()
        });
    }

    render() {
        return <svg height="100" width="100"  x="600" y="500" onClick={this.roll}>
            <image height="100" xlinkHref={"/dice/"+this.state.type+'/'+this.state.value+'.png'} width="100" x="0"
                   y="0"/>
        </svg>
    }

}
DiceComponent.propTypes = {
    game: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired
};