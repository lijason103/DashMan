const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uuidv4 = require('uuid/v4');
const GAME_ROOM = 'GAME_ROOM'
const MAIN_LOBBY = 'MAIN_LOBBY'


server.listen(8000, () => console.log('connected to port 8000!'));

io.on('connection', socket => {
    // Leave the default room
    socket.leaveAll()
    socket.join(MAIN_LOBBY)


    socket.on('CREATE_ROOM', () => {
        let room_id = `${GAME_ROOM}-${uuidv4()}`
        socket.leaveAll()
        socket.join(room_id)
        socket.emit('GAME_ROOMS', getGameRooms(io.sockets.adapter.rooms))
    })

    socket.on('GET_ROOMS', () => {
        socket.emit('GAME_ROOMS', getGameRooms(io.sockets.adapter.rooms))
    })

    socket.on('JOIN_ROOM', room_id => {
        if (room_id.startsWith(GAME_ROOM) && io.sockets.adapter.rooms.hasOwnProperty(room_id)) {
            socket.join(room_id)
        }
    })

    socket.on('disconnect', () => {
        console.log("User disconnected.")
        socket.leaveAll()
    })
})

function getGameRooms(socket_rooms) {
    let rooms = []
    for (let property in socket_rooms) {
        // Only display game rooms
        if (property.startsWith(GAME_ROOM) && socket_rooms.hasOwnProperty(property)) {
            rooms.push({
                id: property,
                numOfPlayers: socket_rooms[property].length
            })
        }
    }
    return rooms
}
