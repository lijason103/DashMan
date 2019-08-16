import React, { Component } from 'react';
import { connect } from 'react-redux'
import './MainLobby.css'
import {
    createGameRoom,
    refreshRooms,
} from '../../socket'

class MainLobby extends Component {
    componentDidMount() {
        this.onRefreshRooms()
    }

    onCreateRoomPress = () => {
        createGameRoom()
    }

    onRefreshRooms = () => {
        refreshRooms()
    }

    render() {
        return <div className="body">
            <button onClick={this.onCreateRoomPress}>Create room</button>
            <button onClick={this.onRefreshRooms}>Refresh rooms</button>
            <div className="listing">
                {this.props.gameRooms.map((room, index) => {
                    return <button key={index}>
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