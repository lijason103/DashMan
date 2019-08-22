import io from 'socket.io-client'

const socket = io('http://localhost:8000')

// Socket listeners
const configureSocket = dispatch => {
	// make sure our socket is connected to the port
	socket.on('connect', () => {
		console.log('connected');
	});

	// A list of game rooms
	socket.on('GAME_ROOMS', gameRooms => {
		dispatch({ type: 'GAME_ROOMS', gameRooms })
	})

	socket.on('GAME_ROOM', gameRoom => {
		dispatch({ type: 'GAME_ROOM', gameRoom })
	})

	socket.on('IN_GAME_STATE', gameState => {
		dispatch({ type: 'GAME_STATE', gameState })
	})

	return socket;
};

export const createGameRoom = () => socket.emit('CREATE_ROOM')

export const refreshRooms = () => socket.emit('GET_ROOMS')

export const joinRoom = room_id => socket.emit('JOIN_ROOM', room_id)

export const leaveRoom = () => socket.emit('LEAVE_ROOM')

export const startGame = () => socket.emit('START_GAME')

export default configureSocket;