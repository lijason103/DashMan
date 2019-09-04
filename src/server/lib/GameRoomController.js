const GameController = require('./GameController')
const uuidv4 = require('uuid/v4');
const GAME_ROOM = 'GAME_ROOM'
const STATES = {
    LOBBY: 'LOBBY',
    INGAME: 'IN-GAME',
}
const MAX_PLAYERS = 6 // max number of players per room

class GameRoomController {
    constructor(socket, io) {
        this.socket = socket
        this.io = io
        this.current_room_id = null
    }

    // ***** Handlers *****

    handle_create_room() {
        this.socket.on('CREATE_ROOM', name => {
            let room_id = `${GAME_ROOM}-${uuidv4()}`
            this.socket.leaveAll()
            this.socket.join(room_id)
    
            let clients = []
            clients.push({
                id: this.socket.id,
                name: this.purifyName(name),
                isReady: false,
            })
            GameRoomController.game_rooms[room_id] = {
                id: room_id,
                status: STATES.LOBBY,
                clients,
                host: clients[0]
            }
            let room = GameRoomController.game_rooms[room_id]
            this.socket.emit('GAME_ROOM', this.generateRoomPayload(room))
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
                    let room = GameRoomController.game_rooms[property]
                    rooms.push(this.generateRoomPayload(room))
                }
            }
            this.socket.emit('GAME_ROOMS', rooms)
        })
    }

    handle_join_room() {
        this.socket.on('JOIN_ROOM', (room_id, name) => {
            if (room_id && room_id.startsWith(GAME_ROOM) && this.io.sockets.adapter.rooms.hasOwnProperty(room_id)) {
                if (GameRoomController.game_rooms[room_id] && 
                    (GameRoomController.game_rooms[room_id].status == 'IN-GAME' || GameRoomController.game_rooms[room_id].clients.length >= MAX_PLAYERS)) { return }
                
                console.log(this.socket.id, " <JOINED ROOM> ", room_id)
                this.socket.leaveAll()
                this.socket.join(room_id)
                this.updateGameRoom(room_id)
                let room = GameRoomController.game_rooms[room_id]
                room.clients = [...room.clients, {
                    id: this.socket.id,
                    name: this.purifyName(name),
                    isReady: false,
                }]
                this.io.in(room_id).emit('GAME_ROOM', this.generateRoomPayload(room))
                this.current_room_id = room_id
            }
        })
    }

    handle_leave_room() {
        this.socket.on('LEAVE_ROOM', () => {
            console.log(this.socket.id, " <LEFT ALL ROOMS> ")
            this.socket.leaveAll()
            this.socket.emit('GAME_ROOM', null) // Tell the client it's no longer in a room
            this.removePlayer()
            this.updateGameRoom(this.current_room_id)
            let room = GameRoomController.game_rooms[this.current_room_id]
            if (room) {
                this.io.in(this.current_room_id).emit('GAME_ROOM', this.generateRoomPayload(room))
                // If player is in game, let the game controller know that someone has been disconnected
                if (room.gameController) room.gameController.handle_player_disconnect(this.socket.id)
            }
            this.current_room_id = null
        })
    }

    handle_ready_game() {
        this.socket.on('READY_GAME', isReady => {
            if (this.current_room_id == null || !GameRoomController.game_rooms.hasOwnProperty(this.current_room_id)) return
            if (this.socket.id === GameRoomController.game_rooms[this.current_room_id].host.id) return
            let room = GameRoomController.game_rooms[this.current_room_id]
            for (let i = 0; i < room.clients.length; ++i) {
                if (room.clients[i].id === this.socket.id) {
                    room.clients[i].isReady = isReady
                    break
                }
            }
            this.io.in(this.current_room_id).emit('GAME_ROOM', this.generateRoomPayload(room))
        })
    }

    handle_start_game() {
        this.socket.on('START_GAME', () => {
            // Check if the game room actually exist
            if (this.current_room_id == null || !GameRoomController.game_rooms.hasOwnProperty(this.current_room_id)) return
            // Check if there is already a game running
            if (GameRoomController.game_rooms[this.current_room_id].gameController) return
            let room = GameRoomController.game_rooms[this.current_room_id]
            // Only host can start
            if (this.socket.id !== room.host.id) return
            // Only when everyone is ready
            for (let i = 0; i < room.clients.length; ++i) {
                if (room.clients[i].id !== room.host.id && !room.clients[i].isReady) {
                    return
                }
            }

            this.updateGameRoom(this.current_room_id, STATES.INGAME)
            room = GameRoomController.game_rooms[this.current_room_id]
            // Create a game controller to handle the game for this particular room
            let clients = GameRoomController.game_rooms[this.current_room_id].clients
            for (let client of clients) {
                client.isReady = false
            }
            this.io.in(this.current_room_id).emit('GAME_ROOM', this.generateRoomPayload(room))
            GameRoomController.game_rooms[this.current_room_id].gameController = new GameController(this.io, this.current_room_id, clients)
            GameRoomController.game_rooms[this.current_room_id].gameController.Initialize(this.onGameOver)

        })
    }

    handle_disconnect() {
        this.socket.on('disconnect', () => {
            console.log(this.socket.id, 'is disconnected from game room')
            this.socket.leaveAll()
            if (this.current_room_id != null) {
                // Remove user from the room
                this.removePlayer()
                this.updateGameRoom(this.current_room_id)
                let room = GameRoomController.game_rooms[this.current_room_id]
                if (room) {
                    this.io.in(this.current_room_id).emit('GAME_ROOM', this.generateRoomPayload(room))

                    // If player is in game, let the game controller know that someone has been disconnected
                    if (room.gameController) room.gameController.handle_player_disconnect(this.socket.id)
                }
                this.current_room_id = null
            }
        })
    }

    generateRoomPayload(room) {
        return {
            id: room.id,
            status: room.status,
            clients: room.clients,
            host: room.clients[0],
            max_clients: MAX_PLAYERS,
        }
    }

    // ***** Helpers *****
    
    purifyName(name) {
        if (!name) return 'unnamed'
        name = name.trim()
        name = name === '' ? 'unnamed' : name
        name = name.length > 10 ? name.substring(0, 10) : name
        return name
    }

    removePlayer() {
        // Remove user from the room
        let room = GameRoomController.game_rooms[this.current_room_id]
        if (!room) return
        let index = -1
        for (let i = 0; i < room.clients.length; ++i) {
            if (room.clients[i].id === this.socket.id) {
                index = i
                break
            }
        }
        if (index > -1) {
            room.clients.splice(index, 1)
        }
    }

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

        // Update host if needed
        // Reassign the host if the old host is gone
        let host = null
        for (let client in GameRoomController.game_rooms[room_id].clients) {
            // Old host still exist
            if (client.id == GameRoomController.game_rooms[room_id].host) {
                host = GameRoomController.game_rooms[room_id].host
                break
            }
        }
        if (!host) host = GameRoomController.game_rooms[room_id].clients[0]

        // Update the status, clients and host in case of client disconnected
        if (GameRoomController.game_rooms.hasOwnProperty(room_id)) {
            GameRoomController.game_rooms[room_id].status = newState ? newState : GameRoomController.game_rooms[room_id].status
            GameRoomController.game_rooms[room_id].host = host
        }
    }

    onGameOver(room_id) {
        console.log('Gameover: deleting game', room_id)
        let gameController = GameRoomController.game_rooms[room_id].gameController
        if (gameController) {
            gameController.removeAllListeners()
        }
        delete GameRoomController.game_rooms[room_id].gameController
        GameRoomController.game_rooms[room_id].status = STATES.LOBBY
    }
}

// Declare static variables that will be shared between all GameRoomController instances
GameRoomController.game_rooms = {}

module.exports = GameRoomController