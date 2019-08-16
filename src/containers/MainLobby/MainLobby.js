import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
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
            <Button variant="outline-primary" onClick={createGameRoom}>Create room</Button>
            <Button variant="outline-primary" onClick={refreshRooms}>Refresh rooms</Button>
            <div className="listing">
                {this.props.gameRooms.map((room, index) => {
                    return <Button key={index} onClick={() => joinRoom(room.id)}>
                        {room.id}-{room.numOfPlayers}
                    </Button>
                })}
            </div>
        </div>
    }
}


const mapStateToProps = state => ({
    gameRooms: state.gameRooms,
});


export default connect(mapStateToProps)(MainLobby);