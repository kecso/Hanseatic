import React from 'react';
import StandardBoard from '../components/StandardBoard.jsx';

export default class TicTacToeView extends React.Component {
    constructor(props) {
        var self;

        super(props);

        self = this;

    }

    render() {
        var dimension = this.props.game.getBoardDimensions();
        return <div>
            <StandardBoard x={dimension.x} y={dimension.y} step={100} game={this.props.game}/>
        </div>;
    }

}

TicTacToeView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired,
    gme: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
};