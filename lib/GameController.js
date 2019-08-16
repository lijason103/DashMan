class GameController {
    constructor(socket, io) {
        this.socket = socket
        this.io = io
        console.log("A game controller is created")
    }

    


    
    removeAllListeners() {
        console.log('Removing all listeners')
    }

}

module.exports = GameController