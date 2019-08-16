import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameRoomLobby.css'
import {
} from '../../socket'

class GameRoomLobby extends Component {
    render() {
        return <div className="body">
            
        </div>
    }
}

const mapStateToProps = state => ({
});


export default connect(mapStateToProps)(GameRoomLobby);