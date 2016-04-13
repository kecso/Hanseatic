'use strict';
/**
 * @author kecso / https://github.com/kecso
 */

import React from 'react';

export default class GameStateComponent extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            finished: this.props.finished,
            player: this.props.player
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            finished: nextProps.finished,
            player: nextProps.player
        });
    }

    render() {
        return <div className="col-sm-12">
            <div className="col-sm-offset-1 col-sm-2">
                <div className="input-group">
                    <span className="input-group-addon" id="task-game">Game</span>
                    <label className="form-control" aria-describedby="task-game">
                        {this.state.finished === true ? 'finished' : 'ongoing'}
                    </label>
                </div>
                <div className="input-group">
                    <span className="input-group-addon" id="task-turn">Turn</span>
                    <label className="form-control" aria-describedby="task-turn">
                        {this.state.player}
                    </label>
                </div>

            </div>
        </div>
    }

}
GameStateComponent.propTypes = {
    finished: React.PropTypes.bool.isRequired,
    player: React.PropTypes.string.isRequired
};