const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const GameRoomController = require('./lib/GameRoomController')

server.listen(8000, () => console.log('connected to port 8000!'));

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

    socket.on('disconnect', () => {
        console.log("User disconnected.")
        gameRoomController.onSocketDisconnect()
    })


})