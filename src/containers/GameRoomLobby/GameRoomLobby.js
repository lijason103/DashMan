import React, { Component } from 'react';
import { socket } from '../../index'
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import GameContainer from '../GameContainer/GameContainer'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
import {
    leaveRoom,
    startGame,
} from '../../socket'
import {
    SET_GAME_ROOM,
} from '../../redux/actions'

class GameRoomLobby extends Component {
    constructor(props) {
        super(props)
        console.log('Game Room Lobby')
    }

    onBackPress = () => {
        leaveRoom()
        this.props.dispatch({ type:SET_GAME_ROOM, gameRoom: null })
    }

    onStartPress = () => {
        startGame()
    }

    renderGameRoom() {
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
                            <td>{socket.id === client ? <b>{client}</b> : client}</td>
                            <td>{this.props.gameRoom.host === client ? 'HOST' : ''}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>
    }

    render() {
        if (this.props.gameOverState || (this.props.gameState && this.props.gameRoom.status === 'IN-GAME')) {
            return <GameContainer />
        }
        return this.renderGameRoom()
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom,
    gameOverState: state.gameOverState,
    gameState: state.gameState,
});

export default connect(mapStateToProps)(GameRoomLobby);