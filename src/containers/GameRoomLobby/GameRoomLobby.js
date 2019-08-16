import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import { Button } from 'react-bootstrap'
import {
    leaveRoom,
} from '../../socket'

class GameRoomLobby extends Component {
    onBackPress = () => {
        leaveRoom()
        // TODO: set game room to be null
    }

    render() {
        return <div className="body">
            <h1>Game Room {this.props.gameRoom.id}</h1>
            <Button onClick={this.onBackPress}>
                Back to main lobby
            </Button>
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