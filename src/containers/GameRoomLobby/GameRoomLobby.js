import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import {
    leaveRoom,
    joinRoom
} from '../../socket'

class GameRoomLobby extends Component {
    componentDidMount() {
        if (!this.props.gameRoom) {
            // TODO: What to do when game room doesn't exist????
            joinRoom()
        }
    }

    onBackPress = () => {
        leaveRoom()
        // TODO: set game room to be null
    }

    render() {
        return <div className="body">
            <h1>Game Room {this.props.gameRoom.id}</h1>
            <button onClick={this.onBackPress}>
                Back to main lobby
            </button>
            {this.props.gameRoom && <div>
                {this.props.gameRoom.clients.map((client, index) => {
                    return <div key={index}>
                        {client}
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