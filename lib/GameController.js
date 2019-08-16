class Player{
    constructor(x, y) {
        this.x = x
        this.y = y
        this.hp = 100
    }
}

class GameController {
    constructor(socket, io, room_id) {
        this.room_id
        this.socket = socket
        this.io = io
        this.room_id = room_id
        console.log("A game controller is created")

        // Initialize game states
        this.players = {}
        for (let property in this.io.sockets.adapter.rooms[this.room_id].sockets) {
            this.players[property] = new Player(100, 100)
        }
        this.send_gameState()
    }

    send_gameState() {
        let payload = {
            players: this.players
        }
        this.io.in(this.room_id).emit('IN_GAME_STATE', payload)
    }


    
    // Should be acted as a destructor as well
    removeAllListeners() {
        console.log('Removing all listeners')
    }

}

module.exports = GameController