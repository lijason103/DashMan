import React, { Component } from 'react';
import MainLobby from './containers/MainLobby/MainLobby'
import GameRoomLobby from './containers/GameRoomLobby/GameRoomLobby'
import GameContainer from './containers/GameContainer/GameContainer'
import { connect } from 'react-redux'

class App extends Component {
	renderGameRoom() {
		if (!this.props.gameRoom) return
		switch(this.props.gameRoom.status) {
			case "LOBBY": return <GameRoomLobby />
			case "IN-GAME": return <GameContainer />
			default: return
		}
	}

	render() {
		return <div>
			{!this.props.gameRoom && <MainLobby />}
			{this.renderGameRoom()}
		</div>
	}
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom
});


export default connect(mapStateToProps)(App);