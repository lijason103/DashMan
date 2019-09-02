import React, { Component } from 'react';
import { socket } from '../../index'
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import GameContainer from '../GameContainer/GameContainer'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
import {
    leaveRoom,
    startGame,
    readyGame,
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
        let isReady
        let isEveryoneReady = true
        for (let client of this.props.gameRoom.clients) {
            if (client.id === socket.id) {
                isReady = client.isReady
            }
            if (client.id !== this.props.gameRoom.host.id && !client.isReady) {
                isEveryoneReady = false
            }
        }
        return <div className="body">
            <h1>Game Room {this.props.gameRoom.id.slice(-5)}</h1>
            <ButtonGroup>
                <Button variant="dark" onClick={this.onBackPress}>
                    Back to main lobby
                </Button>
                {this.props.gameRoom.host.id === socket.id && 
                <Button variant="dark" onClick={this.onStartPress} 
                        disabled={process.env.NODE_ENV === 'production' && (!this.props.gameRoom || this.props.gameRoom.clients.length <= 1 || !isEveryoneReady)}>               
                    Start Game
                </Button>}
                {this.props.gameRoom.host.id !== socket.id && 
                <Button variant="dark" onClick={() => readyGame(!isReady)} >
                    {isReady ? 'Cancel' : 'Ready'}
                </Button>}
            </ButtonGroup>

            <Table striped bordered hover>
                <thead>
                    <tr >
                        <th>Name</th>
                        {/* <th>#</th> */}
                        <th>. . . . . . . . . . .</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.gameRoom && this.props.gameRoom.clients.map((client, index) => {
                        let isHost = this.props.gameRoom.host.id === client.id
                        return <tr key={index}>
                            <td>{socket.id === client.id ? <b>{client.name}</b> : client.name}</td>
                            {/* <td>{socket.id === client.id ? <b>{client.id}</b> : client.id}</td> */}
                            <td>
                                {isHost && 
                                    <b style={{color: '#FF9800'}}>HOST</b>
                                }
                                {!isHost && client.isReady && 
                                    <b style={{color: '#4CAF50'}}>Ready</b>
                                }
                                {!isHost && !client.isReady &&
                                    <b style={{color: '#BDBDBD'}}>Not Ready</b>
                                }
                            </td>
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