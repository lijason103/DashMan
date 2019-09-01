const Player = require('./GameObjects/Player')
const Map = require('./GameObjects/Map')
const config = require('../config.json')

const BUFF_SPAWN_RATE = 10000 // ms

class GameController {
    constructor(io, room_id, clients) {
        this.io = io
        this.room_id = room_id
        console.log("A game controller is created")

        // *** Initialize game states ***
        // Map
        this.map = new Map()

        // Players
        this.players = {}
        let p_i = 1
        for (let client of clients) {
            let id = client.id
            let name = client.name
            let x, y
            switch(p_i){
                case 1: x = 1; y = 1; break // left top corner
                case 2: x = this.map.getWidth()-2; y = 1; break // right top corner
                case 3: x = 1; y = this.map.getHeight()-2; break // bottom left corner
                case 4: x = this.map.getWidth()-2; y = this.map.getHeight()-2; break // bottom right corner
                case 5: x = Math.round(this.map.getWidth()/2); y = 1; break // middle top
                case 6: x = Math.round(this.map.getWidth()/2); y = this.map.getHeight()-2; break // middle bottom
            }
            this.players[id] = new Player(id, name, x, y)
            p_i++
        }
    }

    Initialize(gameOverCallback) {
        this.gameLoopTimer = setInterval(this.gameloop.bind(this), 1000/60)
        this.gl_startTime = new Date()
        this.sendUpdatesTimer = setInterval(this.sendUpdates.bind(this), 1000 / config.networkUpdateFactor)
        this.handle_socket_events()
        this.gameOverCallback = gameOverCallback
        this.buffSpawnTimer = setInterval(this.spawnBuffLoop.bind(this), BUFF_SPAWN_RATE)
    }


    gameloop() {
        let endTime = new Date()
        let elapsedMS = (endTime - this.gl_startTime)/1000
        this.gl_startTime = endTime

        // Update player position
        for (let property in this.players) {
            let player = this.players[property]

            player.move(elapsedMS)
            player.dealCollisionDamage(this.players)
            let buff = this.map.getBuff(Math.floor(player.x), Math.floor(player.y))
            if (buff) buff.activate(player)

            // Add energy
            player.regenerateEnergy(elapsedMS)
        }

        // Check game over
        this.checkGameOver()
    }

    checkGameOver() {
        let numOfAlive = 0
        for (let property in this.players) {
            let player = this.players[property]
            if (player.hp > 0) numOfAlive++
        }
        // Last man standing wins
        if (numOfAlive === 1 && !this.sendGameOverTimer && process.env.NODE_ENV === 'production') {
            this.send_gameOver()
        }
    }

    spawnBuffLoop() {
        this.map.generateBuff()
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
            map: this.map.getAll(),
            players,
        }
        this.io.in(this.room_id).emit('IN_GAME_STATE', payload)
    }

    send_gameOver() {
        this.sendGameOverTimer = setTimeout(() => {
            let players = {}
            let winner
            for (let property in this.players) {
                let player = this.players[property].getAll()
                players[property] = player
                if (player.hp > 0) {
                    winner = player.name
                }
            }
            let payload = {
                players,
                winner,
            }
            this.io.in(this.room_id).emit('GAME_OVER_STATE', payload)
            this.gameOverCallback(this.room_id)
        }, 3000)
    }


    // ************************
    // Receive request from clients
    // ************************
    handle_socket_events() {
        for (let property in this.players) {
            let player = this.players[property]
            let socket = this.io.sockets.sockets[player.id]
            if (socket) {
                socket.on('MOVE_CHAR', payload => {
                    let direction = payload.direction
                    let steps = payload.steps
                    let player = this.players[socket.id]
                    if (player) {
                        player.moveDest(this.map, direction, steps)
                        player.isCharging = false
                    }
                })
                socket.on('START_CHARGE', payload => {
                    let player = this.players[socket.id]
                    if (player) player.isCharging = true
                })
                socket.on('STOP_CHARGE', payload => {
                    let player = this.players[socket.id]
                    if (player) player.isCharging = false
                })
            }
        }
    }

    // This is being called from gameRoomController... read the TODO below
    handle_player_disconnect(socketId) {
        // TODO: figure out a way to listen to 'disconnect' here and be able to remove such listener without affecting
        //       'disconnect' listener in GameRoomController
        console.log(socketId, 'is disconnected from game')
        this.players[socketId].hp = 0
        let socket = this.io.sockets.sockets[socketId]
        if (socket) {
            this.io.sockets.sockets[socketId].removeAllListeners(['MOVE_CHAR'])
        }
    }

    
    // Removes all listeners and timers
    removeAllListeners() {
        console.log('Removing all listeners')
        if (this.gameLoopTimer) clearInterval(this.gameLoopTimer)
        if (this.sendUpdatesTimer) clearInterval(this.sendUpdatesTimer)
        if (this.sendGameOverTimer) clearTimeout(this.sendGameOverTimer)
        if (this.buffSpawnTimer) clearTimeout(this.buffSpawnTimer)
        
        // Remove MOVE_CHAR listener
        for (let property in this.players) {
            let player = this.players[property]
            let socket = this.io.sockets.sockets[player.id]
            if (socket) {
                socket.removeAllListeners(['MOVE_CHAR', 'START_CHARGE', 'STOP_CHARGE'])
            }
        }
    }

}

module.exports = GameController