import io from 'socket.io-client'
import {
	SET_GAME_ROOMS,
	SET_GAME_ROOM,
	SET_GAME_STATE,
	SET_GAME_OVER_STATE,
} from './redux/actions'

const socket = io('http://localhost:8000')

// Socket listeners
const configureSocket = dispatch => {
	// make sure our socket is connected to the port
	socket.on('connect', () => {
		console.log('connected');
	});

	// A list of game rooms
	socket.on('GAME_ROOMS', gameRooms => {
		dispatch({ type: SET_GAME_ROOMS, gameRooms })
	})

	socket.on('GAME_ROOM', gameRoom => {
		dispatch({ type: SET_GAME_ROOM, gameRoom })
	})

	socket.on('IN_GAME_STATE', gameState => {
		dispatch({ type: SET_GAME_STATE, gameState })
	})

	socket.on('GAME_OVER_STATE', gameOverState => {
		dispatch({ type: SET_GAME_OVER_STATE, gameOverState })
	})

	return socket;
};

export const createGameRoom = () => socket.emit('CREATE_ROOM')

export const refreshRooms = () => socket.emit('GET_ROOMS')

export const joinRoom = room_id => socket.emit('JOIN_ROOM', room_id)

export const leaveRoom = () => socket.emit('LEAVE_ROOM')

export const startGame = () => socket.emit('START_GAME')

export default configureSocket;