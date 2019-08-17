import * as Pixi from 'pixi.js';
import { socket } from '../../index'
import Player from './libs/Player'
import Keyboard from './libs/Keyboard'
import ArrowIndicator from './libs/ArrowIndicator'
import Map from './libs/Map'

export default class Game {
    constructor() {
        this.app = new Pixi.Application({
            width: 1125,
            height: 750,
            backgroundColor: 0xf2fbff
        })
        this.players = {}

        // Map
        this.map = null

        // Keyboard inputs
        // TODO: setup a KeyboardManager
        this.upKey = Keyboard('ArrowUp')
        this.downKey = Keyboard('ArrowDown')
        this.rightKey = Keyboard('ArrowRight')
        this.leftKey = Keyboard('ArrowLeft')

        // Arrow Indicator
        this.arrowIndicator = new ArrowIndicator(this.app.stage)

        // Handle socket listeners
        this.handle_game_state()
    }

    // This needs to be called after the Game object is created (including all of the functions)
    Initialize() {
        this.app.ticker.add(this.gameLoop.bind(this))
    }

    // ***** Render game *****

    render() {
        let mPlayer = this.players[socket.id]

        // Render players
        if (this.map) {
            let blockWidth = this.map.getBlockWidth()
            let blockHeight = this.map.getBlockHeight()
            for (let id in this.players) {
                if (this.players.hasOwnProperty(id)) {
                    let player = this.players[id]
                    player.render(blockWidth, blockHeight)
                }
            }
            // Arrow
            if (mPlayer) {
                this.arrowIndicator.render((mPlayer.getX() * blockWidth)/2, (mPlayer.getY() * blockHeight)/2)
            }
        }
    }

    gameLoop(delta) {
        this.render()
        if (this.upKey.isDown) {
            this.arrowIndicator.update('up', 2)
        } else if (this.downKey.isDown) {
            this.arrowIndicator.update('down', 2)
        } else if (this.rightKey.isDown) {
            this.arrowIndicator.update('right', 2)
        } else if (this.leftKey.isDown) {
            this.arrowIndicator.update('left', 2)
        } else {
            this.arrowIndicator.reset()
        }
    }


    
    // ***** Handle socket listeners *****

    handle_game_state() {
        socket.on('IN_GAME_STATE', state => {
            // Create map if it hasn't been created yet
            if (!this.map) this.map = new Map(this.app.stage, state.map.width, state.map.height, this.app.screen.width, this.app.screen.height)

            for (let sPlayer of state.players) {
                if (!this.players.hasOwnProperty(sPlayer.id)) {
                    this.players[sPlayer.id] = (new Player(this.app.stage, sPlayer.x, sPlayer.y, sPlayer.hp))
                } else {
                    this.players[sPlayer.id].update(sPlayer.x, sPlayer.y, sPlayer.hp)
                } 
            }
        })
    }

    // ***** Getters *****
    getApp() {
        return this.app
    }

    // Called when the Game is destroyed
    removeAllListeners() {
        this.app.stop()
        this.app.ticker.stop()
        this.upKey.unsubscribe()
        this.downKey.unsubscribe()
        this.rightKey.unsubscribe()
        this.leftKey.unsubscribe()
    }
}