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
        this.descriptionChange = this.descriptionChange.bind(this);
        this.setCondition = this.setCondition.bind(this);

        this.state = {
            name: this.props.name,
            code: this.props.code,
            description: this.props.description,
            condition: this.props.condition
        }
    }

    save() {
        this.props.update({
            id: this.props.id,
            name: this.state.name,
            code: this.state.code,
            condition: this.state.condition,
            description: this.state.description
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

    descriptionChange(event) {
        this.setState({description: event.target.value});
    }

    setCondition(event) {
        if (event.currentTarget.getAttribute('id') === 'nullCondition') {
            this.setState({condition: null});
        } else {
            this.setState({condition: event.currentTarget.getAttribute('id')});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name,
            code: nextProps.code,
            description: nextProps.description,
            condition: nextProps.condition
        });
    }

    render() {
        var condition,
            conditions = [<li key="nullCondition">
                <a id="nullCondition" onClick={this.setCondition}>
                    none
                </a></li>],
            i,
            functionList = [];
        for (i in this.props.allConditions) {
            conditions.push(<li key={i}>
                <a id={i} onClick={this.setCondition}>
                    {this.props.allConditions[i] + '[' + i + ']'}
                </a></li>);
        }
        if (this.props.hasCondition) {
            condition = <div className="input-group col-sm-9">
                <span className="input-group-addon" id="task-condition">Condition</span>
                <button className="btn btn-default btn-block dropdown-toggle" aria-describedby="task-condition"
                        type="button" id="conditionDropdown" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                    {this.state.condition ? this.props.allConditions[this.state.condition] : "none"}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="conditionDropdown">
                    {conditions}
                </ul>
            </div>;
        } else {
            condition = <div/>;
        }

        for (i = 0; i < this.props.functionlist.length; i += 1) {
            functionList.push(<li key={i}>{this.props.functionlist[i]}</li>);
        }

        return <div className="col-sm-8">
            <div className="input-group col-sm-9">
                <span className="input-group-addon" id="task-name">Name</span>
                <input type="text" className="form-control" aria-describedby="task-name" value={this.state.name}
                       onChange={this.nameChange}/>
            </div>
            {condition}
            <div className="input-group col-sm-9">
                <span className="input-group-addon" id="task-description">Description</span>
                <textarea className="form-control" aria-describedby="task-description" value={this.state.description}
                          onChange={this.descriptionChange}/>
            </div>
            <div className="col-sm-9">
                <textarea className="form-control" rows="20" value={this.state.code} onChange={this.updateCode}/>
                <button className="btn btn-danger" onClick={this.save}>Save changes</button>
                <button className="btn btn-default" onClick={this.cancel}>Cancel</button>
            </div>
            <div className="col-sm-3">
                <ul className="list-group">
                    <h3>Existing functions</h3>
                    {functionList}
                </ul>
            </div>
        </div>
    }

}
ScriptEditComponent.propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    code: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired,
    hasCondition: React.PropTypes.bool.isRequired,
    condition: React.PropTypes.string,
    allConditions: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    functionlist: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};