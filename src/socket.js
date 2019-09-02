import io from 'socket.io-client'
import {
	SET_GAME_ROOMS,
	SET_GAME_ROOM,
	SET_GAME_STATE,
	SET_GAME_OVER_STATE,
} from './redux/actions'

const socketIP = process.env.REACT_APP_SOCKET_IP || 'http://localhost'
const socketPort = '8000'
const socket = process.env.NODE_ENV === 'production' ? io() : io(`${socketIP}:${socketPort}`)

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

export const createGameRoom = playerName => socket.emit('CREATE_ROOM', playerName)

export const refreshRooms = () => socket.emit('GET_ROOMS')

export const joinRoom = (room_id, playerName) => socket.emit('JOIN_ROOM', room_id, playerName)

export const leaveRoom = () => socket.emit('LEAVE_ROOM')

export const startGame = () => socket.emit('START_GAME')

export const readyGame = isReady => socket.emit('READY_GAME', isReady)

export default configureSocket;