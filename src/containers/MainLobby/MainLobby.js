import React, { Component } from 'react';
import { connect } from 'react-redux'
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
            <button onClick={createGameRoom}>Create room</button>
            <button onClick={refreshRooms}>Refresh rooms</button>
            <div className="listing">
                {this.props.gameRooms.map((room, index) => {
                    return <button key={index} onClick={() => joinRoom(room.id)}>
                        {room.id}-{room.numOfPlayers}
                    </button>
                })}
            </div>
        </div>
    }
}


const mapStateToProps = state => ({
    gameRooms: state.gameRooms,
});


export default connect(mapStateToProps)(MainLobby);