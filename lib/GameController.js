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
        for (let id in this.io.sockets.adapter.rooms[this.room_id].sockets) {
            this.players[id] = new Player(id, 1, 1)
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
            player.move(elapsedMS)

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


    // *** Receive request from clients ***
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

    
    // Should be acted as a destructor as well
    removeAllListeners() {
        console.log('Removing all listeners')
        if (this.gameLoopTimer) clearInterval(this.gameLoopTimer)
        if (this.sendUpdatesTimer) clearInterval(this.sendUpdatesTimer)
    }

}

module.exports = GameController