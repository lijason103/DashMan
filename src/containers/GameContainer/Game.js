import * as Pixi from 'pixi.js';

import { socket } from '../../index'
import Player from './libs/Player'
import Keyboard from './libs/Keyboard'
import ArrowIndicator from './libs/ArrowIndicator'
import Map from './libs/Map'

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.app = new Pixi.Application({
            width: gameWidth,
            height: gameHeight,
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
            this.arrowIndicator.render(mPlayer.getX() * blockWidth + blockWidth/2, mPlayer.getY() * blockHeight + blockHeight/2)
        }
    }

    gameLoop(deltaMS) {
        let elapsedMS = this.app.ticker.elapsedMS
        if (!this.map) return
        this.render()
        let mPlayer = this.players[socket.id]
        let blockWidth = this.map.getBlockWidth()
        let blockHeight = this.map.getBlockHeight()

        // Update arrow indicator
        if (mPlayer.hp > 0) {
            if (this.upKey.isDown) {
                this.arrowIndicator.update(elapsedMS, 'up', mPlayer.getChargeRate(), blockHeight)
            } else if (this.downKey.isDown) {
                this.arrowIndicator.update(elapsedMS, 'down', mPlayer.getChargeRate(), blockHeight)
            } else if (this.rightKey.isDown) {
                this.arrowIndicator.update(elapsedMS, 'right', mPlayer.getChargeRate(), blockWidth)
            } else if (this.leftKey.isDown) {
                this.arrowIndicator.update(elapsedMS, 'left', mPlayer.getChargeRate(), blockWidth)
            } else {
                // Send move request to server
                let numOfBlocks = Math.floor(this.arrowIndicator.getNumOfBlock())
                if (numOfBlocks > 0) {
                    console.log(numOfBlocks)
                    socket.emit('MOVE_CHAR', {
                        direction: this.arrowIndicator.direction,
                        steps: numOfBlocks
                    })
                }
                this.arrowIndicator.reset()
            }
        }
    }


    
    // ***** Handle socket listeners *****

    handle_game_state() {
        socket.on('IN_GAME_STATE', state => {
            // Create map if it hasn't been created yet
            if (!this.map) this.map = new Map(this.app.stage, state.map.width, state.map.height, this.app.screen.width, this.app.screen.height)
            for (let property in state.players) {
                let sPlayer = state.players[property]
                if (!this.players.hasOwnProperty(sPlayer.id)) {
                    // New player
                    this.players[sPlayer.id] = (
                        new Player(
                            this.app.stage,
                            sPlayer.id,
                            sPlayer.x, 
                            sPlayer.y, 
                            sPlayer.hp, 
                            sPlayer.chargeRate
                        ))
                } else {
                    // Update player
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