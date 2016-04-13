'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class ContextMenuComponent extends React.Component {
    constructor(props) {

        super(props);

        this.onSelect = this.onSelect.bind(this);

        this.state = {
            items: this.props.items,
            onSelect: this.props.onSelect
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            items: nextProps.items,
            onSelect: nextProps.onSelect
        });
    }

    onSelect(event) {
        this.state.onSelect(event.target.getAttribute('id'));
    }

    render() {
        var items = [],
            i;
        for (i = 0; i < this.state.items.length; i += 1) {
            items.push(<a id={this.state.items[i]} key={i} className="list-group-item" onClick={this.onSelect}>
                {this.state.items[i]}</a>);
        }
        return <div className="list-group"
                    style={{position:'absolute',left:this.props.x+'px', top:this.props.y+'px'}}>{items}
        </div>;
    }

}
ContextMenuComponent.propTypes = {
    items: React.PropTypes.array.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    onSelect: React.PropTypes.func.isRequired
};