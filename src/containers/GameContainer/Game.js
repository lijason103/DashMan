import * as Pixi from 'pixi.js';
import { socket } from '../../index'

import ControlManager from './libs/ControlManager'
import Player from './libs/Player'
import ArrowIndicator from './libs/ArrowIndicator'
import Map from './libs/Map'

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.app = new Pixi.Application({
            width: gameWidth,
            height: gameHeight,
            backgroundColor: 0xf2fbff,
            antialias: true,
        })
        this.players = {}

        // Map
        this.map = new Map(this.app.stage, this.app.screen.width, this.app.screen.height)

        // Arrow Indicator
        this.arrowIndicator = new ArrowIndicator(this.app.stage)

        // Handle socket listeners
        this.handle_game_state()
    }

    // This needs to be called after the Game object is created (including all of the functions)
    Initialize() {
        this.app.ticker.add(this.gameLoop.bind(this))
    }

    // This should be called after the canvas is loaded 
    InitalizeControlManager(id) {
        this.controlManager = new ControlManager(id)
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
        if (this.map.isEmpty()) return
        this.render()
        let mPlayer = this.players[socket.id]
        let blockWidth = this.map.getBlockWidth()
        let blockHeight = this.map.getBlockHeight()

        // Update arrow indicator
        if (mPlayer.hp > 0) {
            if (this.controlManager.getIsUp()) {
                this.arrowIndicator.update(elapsedMS, 'up', mPlayer.getChargeRate(), blockHeight)
            } else if (this.controlManager.getIsDown()) {
                this.arrowIndicator.update(elapsedMS, 'down', mPlayer.getChargeRate(), blockHeight)
            } else if (this.controlManager.getIsRight()) {
                this.arrowIndicator.update(elapsedMS, 'right', mPlayer.getChargeRate(), blockWidth)
            } else if (this.controlManager.getIsLeft()) {
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
            if (this.map.isEmpty()) {
                this.map.setStructures(state.map.structures)
            }
            let player_num = 0
            for (let property in state.players) {
                let sPlayer = state.players[property]
                if (!this.players.hasOwnProperty(sPlayer.id)) {
                    // New player
                    this.players[sPlayer.id] = (
                        new Player(
                            this.app.stage,
                            player_num,
                            sPlayer.id,
                            sPlayer.x, 
                            sPlayer.y, 
                            sPlayer.hp, 
                            sPlayer.chargeRate,
                            sPlayer.max_hp
                        ))
                    player_num++
                } else {
                    // Update player
                    this.players[sPlayer.id].update(sPlayer.x, sPlayer.y, sPlayer.hp)
                } 
            }
        })
    }

    resize(width, height) {
        this.app.renderer.resize(width, height)
        this.app.stage.width = width
        this.app.stage.height = height
        if (!this.map.isEmpty()) {
            this.map.renderBackground()
        }
    }

    getApp() {
        return this.app
    }

    // Called when the Game is destroyed
    removeAllListeners() {
        this.app.stop()
        this.app.ticker.stop()
        this.controlManager.destroy()
    }
}