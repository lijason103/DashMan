import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, ButtonGroup, Table } from 'react-bootstrap'
import './MainLobby.css'
import {
    createGameRoom,
    refreshRooms,
    joinRoom,
} from '../../socket'

class MainLobby extends Component {
    componentDidMount() {
        refreshRooms()
        console.log("Main Lobby")
    }

    render() {
        return <div className="body">
            <h1>Lobby</h1>
            <ButtonGroup>
                <Button variant="outline-primary" onClick={createGameRoom}>Create room</Button>
                <Button variant="outline-primary" onClick={refreshRooms}>Refresh rooms</Button>
            </ButtonGroup>
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
                                <Button onClick={() => joinRoom(room.id)}>JOIN</Button>
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
});


export default connect(mapStateToProps)(MainLobby);