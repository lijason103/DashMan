// Initalize
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1000,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 0 }
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);

function preload() {
    console.log("Phaser Preload")
    const socket = io()
    this.socket = socket
    this.socket.on('connect', () => {
        console.log("Connected")
    })
    this.socket.on('disconnect', id => {
        console.log('Disconnected')
    })
}

function create() {
    console.log("Phaser Create")
    this.socket.on('test', msg => {
        console.log(msg)
    })
}

function update(time, delta) {

}