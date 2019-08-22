const GameController = require('./GameController')
const uuidv4 = require('uuid/v4');
const GAME_ROOM = 'GAME_ROOM'
const STATES = {
    LOBBY: 'LOBBY',
    INGAME: 'IN-GAME',
}

class GameRoomController {
    constructor(socket, io) {
        this.socket = socket
        this.io = io
        this.current_room_id = null
    }

    // ***** Handlers *****

    handle_create_room() {
        this.socket.on('CREATE_ROOM', () => {
            let room_id = `${GAME_ROOM}-${uuidv4()}`
            this.socket.leaveAll()
            this.socket.join(room_id)
    
            let socket_rooms = this.io.sockets.adapter.rooms
            let clients = []
            for (let property in socket_rooms[room_id].sockets) {
                clients.push(property)
            }
            GameRoomController.game_rooms[room_id] = {
                id: room_id,
                status: STATES.LOBBY,
                clients,
                host: clients[0]
            }
    
            this.socket.emit('GAME_ROOM', GameRoomController.game_rooms[room_id])
            console.log(this.socket.id, " <CREATED ROOM> ", room_id)
            this.current_room_id = room_id
        })
    }

    handle_get_rooms() {
        this.socket.on('GET_ROOMS', () => {
            console.log(this.socket.id, " <GET ROOMS> ")
            // Convert it into an array
            let rooms = []
            for (let property in GameRoomController.game_rooms) {
                if (GameRoomController.game_rooms.hasOwnProperty(property)) {
                    rooms.push(GameRoomController.game_rooms[property])
                }
            }
            this.socket.emit('GAME_ROOMS', rooms)
        })
    }

    handle_join_room() {
        this.socket.on('JOIN_ROOM', room_id => {
            if (room_id && room_id.startsWith(GAME_ROOM) && this.io.sockets.adapter.rooms.hasOwnProperty(room_id)) {
                console.log(this.socket.id, " <JOINED ROOM> ", room_id)
                this.socket.leaveAll()
                this.socket.join(room_id)
                this.updateGameRoom(room_id)
                this.io.in(room_id).emit('GAME_ROOM', GameRoomController.game_rooms[room_id])
                this.current_room_id = room_id
            }
        })
    }

    handle_leave_room() {
        this.socket.on('LEAVE_ROOM', () => {
            console.log(this.socket.id, " <LEFT ALL ROOMS> ")
            this.socket.leaveAll()
            this.socket.emit('GAME_ROOM', null) // Tell the client it's no longer in a room
            this.updateGameRoom(this.current_room_id)
            this.io.in(this.current_room_id).emit('GAME_ROOM', GameRoomController.game_rooms[this.current_room_id])
            this.current_room_id = null
        })
    }

    handle_start_game() {
        this.socket.on('START_GAME', () => {
            // Check if the game room actually exist
            if (this.current_room_id == null || !GameRoomController.game_rooms.hasOwnProperty(this.current_room_id)) return
            // Only host can start
            if (this.socket.id != GameRoomController.game_rooms[this.current_room_id].host) return

            this.updateGameRoom(this.current_room_id, STATES.INGAME)
            this.io.in(this.current_room_id).emit('GAME_ROOM', GameRoomController.game_rooms[this.current_room_id])

            // Create a game controller to handle the game for this particular room
            GameRoomController.game_rooms[this.current_room_id].gameController = new GameController(this.io, this.current_room_id)
            GameRoomController.game_rooms[this.current_room_id].gameController.Initialize()
        })
    }


    // ***** Actions *****
    
    onSocketDisconnect() {
        this.socket.leaveAll()
        if (this.current_room_id != null) {
            this.updateGameRoom(this.current_room_id)
            this.io.in(this.current_room_id).emit('GAME_ROOM', GameRoomController.game_rooms[this.current_room_id])
            this.current_room_id = null
        }
    }


    // ***** Helpers *****
    
    updateGameRoom(room_id, newState) {
        let socket_rooms = this.io.sockets.adapter.rooms
        // Delete the game room if it is no longer in socket_room because there are no more connected clients
        if (!socket_rooms.hasOwnProperty(room_id)) {
            if (GameRoomController.game_rooms.hasOwnProperty(room_id)) {
                console.log('Deleting game room...', room_id)
                // Clean up the listeners in the game controller and delete the game controller
                let gameController = GameRoomController.game_rooms[room_id].gameController
                if (gameController) {
                    gameController.removeAllListeners()
                }
                delete GameRoomController.game_rooms[room_id].gameController
                delete GameRoomController.game_rooms[room_id]
                console.log('Deleted game room...', room_id)
            }
            return
        }
    
        // Get a list of connected clients
        let clients = []
        for (let property in socket_rooms[room_id].sockets) {
            clients.push(property)
        }
    
        // Reassign the host if the old host is gone
        let host = null
        for (let client in clients) {
            // Old host still exist
            if (client == GameRoomController.game_rooms[room_id].host) {
                host = GameRoomController.game_rooms[room_id].host
                break
            }
        }
        if (!host) host = clients[0]
    
        GameRoomController.game_rooms[room_id] = {
            id: room_id,
            status: newState ? newState : GameRoomController.game_rooms[room_id].status,
            clients,
            host,
        }
    }
}

// Declare static variables that will be shared between all GameRoomController instances
GameRoomController.game_rooms = {}

module.exports = GameRoomController