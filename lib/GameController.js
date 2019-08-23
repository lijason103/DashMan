const Player = require('./GameObjects/Player')
const config = require('../config.json')

class GameController {
    constructor(io, room_id) {
        this.io = io
        this.room_id = room_id
        console.log("A game controller is created")

        // Initialize game states
        // Map
        this.map = {
            width: 15, // # of blocks
            height: 10, // # of blocks
        }

        // Players
        this.players = {}
        let p_i = 1
        for (let id in this.io.sockets.adapter.rooms[this.room_id].sockets) {
            let x, y
            switch(p_i){
                case 1: x = 0; y = 0; break // left top corner
                case 2: x = this.map.width-1; y = 0; break // right top corner
                case 3: x = 0; y = this.map.height-1; break // bottom left corner
                case 4: x = this.map.width-1; y = this.map.height-1; break // bottom right corner
                case 5: x = Math.round(this.map.width/2); y = 0; break // middle top
                case 6: x = Math.round(this.map.width/2); y = this.map.height-1; break // middle bottom
            }
            this.players[id] = new Player(id, x, y)
            p_i++
        }
    }

    Initialize() {
        this.gameLoopTimer = setInterval(this.gameloop.bind(this), 1000/60)
        this.gl_startTime = new Date()
        this.sendUpdatesTimer = setInterval(this.sendUpdates.bind(this), 1000 / config.networkUpdateFactor)
        this.handle_move_char()
    }


    gameloop() {
        let endTime = new Date()
        let elapsedMS = (endTime - this.gl_startTime)/1000
        this.gl_startTime = endTime

        // Update player position
        for (let property in this.players) {
            let player = this.players[property]
            let otherPlayers = { ...this.players }
            delete otherPlayers[property]
            player.move(elapsedMS, otherPlayers)

            // Add energy
            player.regenerateEnergy(elapsedMS)
        }
    }

    sendUpdates() {
        this.send_gameState()
    }

    // *** Send States to Clients ***

    send_gameState() {
        let players = {}
        for (let property in this.players) {
            let player = this.players[property].getAll()
            players[property] = player
        }
        let payload = {
            map: this.map,
            players,
        }
        this.io.in(this.room_id).emit('IN_GAME_STATE', payload)
    }


    // ************************
    // Receive request from clients
    // ************************

    handle_move_char() {
        for (let property in this.io.sockets.sockets) {
            let socket = this.io.sockets.sockets[property]
            socket.on('MOVE_CHAR', payload => {
                let direction = payload.direction
                let steps = payload.steps
                let player = this.players[socket.id]
                if (player) player.moveDest(direction, steps)
            })
        }
    }

    // This is being called from gameRoomController... read the TODO below
    handle_player_disconnect(socketId) {
        // TODO: figure out a way to listen to 'disconnect' here and be able to remove such listener without affecting
        //       'disconnect' listener in GameRoomController
        console.log(socketId, 'is disconnected from game')
        this.players[socketId].setHp(0)
    }

    
    // Removes all listeners and timers
    removeAllListeners() {
        console.log('Removing all listeners')
        if (this.gameLoopTimer) clearInterval(this.gameLoopTimer)
        if (this.sendUpdatesTimer) clearInterval(this.sendUpdatesTimer)
        
        // Remove MOVE_CHAR listener
        for (let property in this.io.sockets.sockets) {
            let socket = this.io.sockets.sockets[property]
            socket.removeAllListeners(['MOVE_CHAR'])
        }
    }

}

module.exports = GameController