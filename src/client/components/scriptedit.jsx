'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class ScriptEditComponent extends React.Component {
    constructor(props) {

        super(props);

        this.updateCode = this.updateCode.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);

        this.state = {
            name: this.props.name,
            code: this.props.code
        }
    }

    save() {
        this.props.update({
            id: this.props.id,
            name: this.state.name,
            code: this.state.code
        });
    }

    cancel() {
        this.props.update(null);
    }

    updateCode(event) {
        this.setState({code: event.target.value});
    }

    nameChange(event) {
        this.setState({name: event.target.value});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name,
            code: nextProps.code
        });
    }

    render() {
        var options = {
            mode: "javascript",
            lineNumbers: true,
            readOnly: false
        };
        return <div className="col-sm-6">
            <div className="input-group">
                <span className="input-group-addon" id="task-name">Name</span>
                <input type="text" className="form-control" aria-describedby="task-name" value={this.state.name}
                       onChange={this.nameChange}/>
            </div>
            <textarea className="form-control" rows="20" value={this.state.code} onChange={this.updateCode}/>
            <button className="btn btn-danger" onClick={this.save}>Save changes</button>
            <button className="btn btn-default" onClick={this.cancel}>Cancel</button>
        </div>
    }

}
ScriptEditComponent.propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    code: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired
};