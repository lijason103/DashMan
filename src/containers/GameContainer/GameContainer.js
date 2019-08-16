import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameContainer.css'
import { Button, ButtonGroup } from 'react-bootstrap'
import {
    leaveRoom,
} from '../../socket'

class GameContainer extends Component {
    onBackPress = () => {
        leaveRoom()
        // TODO: set game room to be null
    }

    render() {
        return <div className="body">
            <h1>Game {this.props.gameRoom.id}</h1>
            <ButtonGroup>
                <Button variant="outline-primary" onClick={this.onBackPress}>
                    Quit
                </Button>
            </ButtonGroup>
        </div>
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom
});

export default connect(mapStateToProps)(GameContainer);