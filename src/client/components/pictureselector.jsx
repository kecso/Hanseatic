'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class PictureSelectorComponent extends React.Component {
    constructor(props) {
        super(props);

        this.select = this.select.bind(this);

        this.state = {
            list: this.props.list,
            base: this.props.base
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({list: nextProps.list, base: nextProps.base});
    }

    select(event) {
        this.props.onFinish(event.currentTarget.getAttribute('id'));
    }

    render() {
        var list = [],
            i, x, y;
        for (i = 0; i < this.state.list.length; i += 1) {
            x = i % 7;
            y = Math.trunc(i / 7);
            list.push(<image xlinkHref={this.state.base+this.state.list[i]} height="100" width="100"
                             x={x*100} y={y*100} key={this.state.list[i]} id={this.state.list[i]}
                             onClick={this.select}/>)
        }
        return <svg width="700" height={Math.trunc(this.state.list.length/7 +1)*100}>
            {list}
        </svg>
    }
}

PictureSelectorComponent.propTypes = {
    list: React.PropTypes.array.isRequired,
    base: React.PropTypes.string.isRequired,
    onFinish: React.PropTypes.func.isRequired
};
