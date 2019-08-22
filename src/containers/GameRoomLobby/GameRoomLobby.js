import React, { Component } from 'react';
import { socket } from '../../index'
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import { Button, ButtonGroup } from 'react-bootstrap'
import {
    leaveRoom,
    startGame,
} from '../../socket'

class GameRoomLobby extends Component {
    constructor(props) {
        super(props)
        console.log('Game Room Lobby')
    }

    onBackPress = () => {
        leaveRoom()
        // TODO: set game room to be null
    }

    onStartPress = () => {
        startGame()
    }

    render() {
        console.log(this.props.gameRoom)
        return <div className="body">
            <h1>Game Room {this.props.gameRoom.id}</h1>
            <ButtonGroup>
                <Button variant="outline-primary" onClick={this.onBackPress}>
                    Back to main lobby
                </Button>
                {this.props.gameRoom.host === socket.id && <Button variant="outline-primary" onClick={this.onStartPress}>
                    Start Game
                </Button>}
            </ButtonGroup>
            {this.props.gameRoom && <div>
                {this.props.gameRoom.clients.map((client, index) => {
                    return <div key={index}>
                        {client}{this.props.gameRoom.host === client && ' - HOST'}
                    </div>
                })}
            </div>}
        </div>
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom
});

export default connect(mapStateToProps)(GameRoomLobby);