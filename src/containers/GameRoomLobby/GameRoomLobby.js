import React, { Component } from 'react';
import { socket } from '../../index'
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
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
        return <div className="body">
            <h1>Game Room {this.props.gameRoom.id.slice(-5)}</h1>
            <ButtonGroup>
                <Button variant="outline-primary" onClick={this.onBackPress}>
                    Back to main lobby
                </Button>
                {this.props.gameRoom.host === socket.id && <Button variant="outline-primary" onClick={this.onStartPress}>
                    Start Game
                </Button>}
            </ButtonGroup>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Host</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.gameRoom && this.props.gameRoom.clients.map((client, index) => {
                        return <tr key={index}>
                            <td>{client}</td>
                            <td>{this.props.gameRoom.host === client ? 'HOST' : ''}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom
});

export default connect(mapStateToProps)(GameRoomLobby);