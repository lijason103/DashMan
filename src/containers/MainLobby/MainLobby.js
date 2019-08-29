import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, ButtonGroup, Table, InputGroup, FormControl } from 'react-bootstrap'
import './MainLobby.css'
import { SET_PLAYER_NAME } from '../../redux/actions'
import {
    createGameRoom,
    refreshRooms,
    joinRoom,
} from '../../socket'

class MainLobby extends Component {
    changePlayerName = name => {
        this.props.dispatch({ type:SET_PLAYER_NAME, playerName: name })
    }

    componentDidMount() {
        refreshRooms()
        console.log("Main Lobby")
    }

    render() {
        return <div className="body">
            <h1>Lobby</h1>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <ButtonGroup>
                    <Button variant="outline-primary" onClick={() => createGameRoom(this.props.playerName)}>Create room</Button>
                    <Button variant="outline-primary" onClick={refreshRooms}>Refresh rooms</Button>
                </ButtonGroup>
                <InputGroup>
                    <FormControl value={this.props.playerName} onChange={event => this.changePlayerName(event.target.value)}/>
                </InputGroup>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Players</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.gameRooms.map((room, index) => {
                        return <tr key={index}>
                            <td>{room.id.slice(-5)}</td>
                            <td>{room.clients.length}/{room.max_clients}</td>
                            <td>{room.status}</td>
                            <td>
                                {room.clients.length < room.max_clients && room.status !== 'IN-GAME' &&
                                    <Button onClick={() => joinRoom(room.id, this.props.playerName)}>JOIN</Button>
                                }
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>
    }
}


const mapStateToProps = state => ({
    gameRooms: state.gameRooms,
    playerName: state.playerName,
});


export default connect(mapStateToProps)(MainLobby);