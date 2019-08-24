import React, { Component } from 'react';
import MainLobby from './containers/MainLobby/MainLobby'
import GameRoomLobby from './containers/GameRoomLobby/GameRoomLobby'
import { connect } from 'react-redux'

class App extends Component {
	render() {
		return <div>
			{this.props.gameRoom ? <GameRoomLobby /> : <MainLobby />}
		</div>
	}
}

const mapStateToProps = state => ({
	gameRoom: state.gameRoom,
});


export default connect(mapStateToProps)(App);