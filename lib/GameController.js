const Player = require('./GameObjects/Player')
const config = require('../config.json')

class GameController {
    constructor(socket, io, room_id) {
        this.socket = socket
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
        this.players = []
        for (let id in this.io.sockets.adapter.rooms[this.room_id].sockets) {
            this.players.push(new Player(id, 100, 100))
        }
    }

    Initialize() {
        this.gameLoopTimer = setInterval(this.gameloop.bind(this), 1000/60)
        this.sendUpdatesTimer = setInterval(this.sendUpdates.bind(this), 1000 / config.networkUpdateFactor)
    }


    gameloop() {
        // console.log('updating')
        // for (let player of this.players) {
        //     player.setX(player.getX())
        //     player.setY(player.getY())
        // }
    }

    sendUpdates() {
        this.send_gameState()
    }

    send_gameState() {
        // console.log('sending state')
        let payload = {
            map: this.map,
            players: this.players.map(player => player.getAll())
        }
        this.io.in(this.room_id).emit('IN_GAME_STATE', payload)
    }
    
    // Should be acted as a destructor as well
    removeAllListeners() {
        console.log('Removing all listeners')
        if (this.gameLoopTimer) clearInterval(this.gameLoopTimer)
        if (this.sendUpdatesTimer) clearInterval(this.sendUpdatesTimer)
    }

}

module.exports = GameController