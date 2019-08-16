const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uuidv4 = require('uuid/v4');
const GAME_ROOM = 'GAME_ROOM'


server.listen(8000, () => console.log('connected to port 8000!'));

io.on('connection', socket => {
    console.log('User connected.')
    // Leave the default room
    socket.leaveAll()
    let current_room_id = null

    socket.on('CREATE_ROOM', () => {
        let room_id = `${GAME_ROOM}-${uuidv4()}`
        socket.leaveAll()
        socket.join(room_id)
        socket.emit('GAME_ROOM', getGameRoom(room_id, io.sockets.adapter.rooms))
        current_room_id = room_id
        console.log(socket.id, " <CREATED ROOM> ", room_id)
    })

    socket.on('GET_ROOMS', () => {
        console.log(socket.id, " <GET ROOMS> ")
        socket.emit('GAME_ROOMS', getGameRooms(io.sockets.adapter.rooms))
    })

    socket.on('JOIN_ROOM', room_id => {
        if (room_id && room_id.startsWith(GAME_ROOM) && io.sockets.adapter.rooms.hasOwnProperty(room_id)) {
            console.log(socket.id, " <JOINED ROOM> ", room_id)
            socket.leaveAll()
            socket.join(room_id)
            io.in(room_id).emit('GAME_ROOM', getGameRoom(room_id, io.sockets.adapter.rooms))
            current_room_id = room_id
        }
    })

    socket.on('LEAVE_ROOM', () => {
        console.log(socket.id, " <LEFT ALL ROOMS> ")
        socket.leaveAll()
        socket.emit('GAME_ROOM', null)
        io.in(current_room_id).emit('GAME_ROOM', getGameRoom(current_room_id, io.sockets.adapter.rooms))
        current_room_id = null
    })

    socket.on('disconnect', () => {
        console.log("User disconnected.")
        socket.leaveAll()
        io.in(current_room_id).emit('GAME_ROOM', getGameRoom(current_room_id, io.sockets.adapter.rooms))
        current_room_id = null
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

// Returns information about a specific game room
function getGameRoom(room_id, socket_rooms) {
    let room = null
    if (socket_rooms.hasOwnProperty(room_id)) {
        let clients = []
        for (let property in socket_rooms[room_id].sockets) {
            clients.push(property)
        }
        room = {
            id: room_id,
            status: 'LOBBY',
            clients,
        }
    }
    return room
}