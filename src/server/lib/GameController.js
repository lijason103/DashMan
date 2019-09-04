const Player = require('./GameObjects/Player')
const Map = require('./GameObjects/Map')
const config = require('../config.json')
const Helper = require('./Helper')

const BUFF_SPAWN_RATE = 8000 // ms w/ 2 players = BUFF_SPAWN_RATE - BUFF_SPAWN_RATE_PER_PLAYER*2
const BUFF_SPAWN_RATE_PER_PLAYER = 500
const COUNT_DOWN_TIME = 3000
const SPEED_UP_TIME = 30000 // every 30 seconds

class GameController {
    constructor(io, room_id, clients) {
        this.io = io
        this.room_id = room_id
        console.log("A game controller is created")

        // *** Initialize game states ***
        // Map
        this.map = new Map()

        // Players
        let positions = [
            {x: 1, y: 1}, // left top corner
            {x: this.map.getWidth()-2, y: 1}, // right top corner
            {x: 1, y: this.map.getHeight()-2}, // bottom left corner
            {x: this.map.getWidth()-2, y: this.map.getHeight()-2}, // bottom right corner
            {x: Math.floor(this.map.getWidth()/2), y: 1}, // middle top
            {x: Math.floor(this.map.getWidth()/2), y: this.map.getHeight()-2}, // middle bottom
        ]
        this.players = {}
        for (let client of clients) {
            let id = client.id
            let name = client.name
            let selectedIndex = Helper.generateRandom(0, positions.length-1)
            let x = positions[selectedIndex].x
            let y = positions[selectedIndex].y
            positions.splice(selectedIndex, 1)
            this.players[id] = new Player(id, name, x, y)
        }

        this.startTime = null
        this.currentGameTime = 0
        this.countDownTime = 0
    }

    Initialize(gameOverCallback) {
        this.gameLoopTimer = setInterval(this.gameloop.bind(this), 1000/60)
        this.gl_startTime = new Date()
        this.sendUpdatesTimer = setInterval(this.sendUpdates.bind(this), 1000 / config.networkUpdateFactor)
        this.handle_socket_events()
        this.gameOverCallback = gameOverCallback
        let buffSpawnRate = BUFF_SPAWN_RATE - (Object.keys(this.players).length * BUFF_SPAWN_RATE_PER_PLAYER)
        this.buffSpawnTimer = setInterval(this.spawnBuffLoop.bind(this), buffSpawnRate)
        this.gameStartCountDownTimer = setTimeout(this.startGameCountDownComplete.bind(this), COUNT_DOWN_TIME)
        this.countDownTime = COUNT_DOWN_TIME
    }

    gameloop() {
        let endTime = new Date()
        let elapsedMS = (endTime - this.gl_startTime)/1000
        this.gl_startTime = endTime
        if (!this.startTime) {
            this.countDownTime -= (elapsedMS*1000)
            return
        }
        this.currentGameTime = endTime.getTime() - this.startTime

        // Update player position
        for (let property in this.players) {
            let player = this.players[property]

            player.move(elapsedMS)
            player.dealCollisionDamage(this.players)
            player.updateBuff(endTime)
            let buff = this.map.getBuff(Math.floor(player.x), Math.floor(player.y))
            if (buff) buff.activate(player)

            // Add energy
            player.regenerateEnergy(elapsedMS)
        }

        // Check game over
        this.checkGameOver()
    }

    startGameCountDownComplete() {
        this.startTime = new Date().getTime()
        this.countDownTime = 0
        this.speedUpTimer = setInterval(this.speedUpGamePace.bind(this), SPEED_UP_TIME)
    }

    speedUpGamePace() {
        for (let property in this.players) {
            let player = this.players[property]
            player.chargeRate += 0.5
            player.energyRate += 0.25
        }
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
            gameTime: this.currentGameTime,
            startCountDownTime: this.countDownTime
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
                    if (!this.startTime) return
                    let direction = payload.direction
                    let steps = payload.steps
                    let player = this.players[socket.id]
                    if (player) {
                        player.moveDest(this.map, direction, steps)
                        player.isCharging = false
                    }
                })
                socket.on('START_CHARGE', payload => {
                    if (!this.startTime) return
                    let player = this.players[socket.id]
                    if (player) player.isCharging = true
                })
                socket.on('STOP_CHARGE', payload => {
                    if (!this.startTime) return
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
        if (this.buffSpawnTimer) clearInterval(this.buffSpawnTimer)
        if (this.gameStartCountDownTimer) clearTimeout(this.gameStartCountDownTimer)
        if (this.speedUpTimer) clearInterval(this.speedUpTimer)
        
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