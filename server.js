const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').config()
const GameRoomController = require('./lib/GameRoomController')

const PORT = process.env.REACT_APP_SOCKET_PORT || 8000
server.listen(PORT, () => console.log(`connected to port ${PORT}!`));

io.on('connection', socket => {
    console.log('User connected.')
    // Leave the default room
    socket.leaveAll()
    let gameRoomController = new GameRoomController(socket, io)

    // *************** ROOM HANDLING ***************
    gameRoomController.handle_create_room()
    gameRoomController.handle_get_rooms()
    gameRoomController.handle_join_room()
    gameRoomController.handle_leave_room()
    gameRoomController.handle_start_game()
    gameRoomController.handle_disconnect()

    socket.on('disconnect', () => {
        console.log(socket.id, 'is disconnected from server')
    })


})