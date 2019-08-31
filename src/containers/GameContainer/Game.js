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
            autoDensity: true,
            resolution: window.devicePixelRatio,
        })
        this.players = {}

        // Map
        this.mapContainer = new Pixi.Container()
        this.app.stage.addChild(this.mapContainer)
        this.map = new Map(this.mapContainer, this.app.screen.width, this.app.screen.height)

        // Arrow Indicator
        this.arrowIndicatorContainer = new Pixi.Container()
        this.app.stage.addChild(this.arrowIndicatorContainer)
        this.arrowIndicator = new ArrowIndicator(this.arrowIndicatorContainer)

        this.playersContainer = new Pixi.Container()
        this.app.stage.addChild(this.playersContainer)

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
        this.controlManager.setOnCancelledCallback(() => {
            socket.emit('STOP_CHARGE', {})
        })
        this.controlManager.setOnReachedThreshCallback(() => {
            socket.emit('START_CHARGE', {})
        })
        this.controlManager.setOnChangeDirectionCallback(() => {
            socket.emit('STOP_CHARGE', {})
            setTimeout(() => socket.emit('START_CHARGE', {}), 200)
        })
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
            this.arrowIndicator.render(mPlayer.getX(), mPlayer.getY(), blockWidth, blockHeight)
        }
    }

    gameLoop(deltaMS) {
        let elapsedMS = this.app.ticker.elapsedMS
        if (this.map.isEmpty()) return
        this.render()
        let mPlayer = this.players[socket.id]
        let blockWidth = this.map.getBlockWidth()
        let blockHeight = this.map.getBlockHeight()

        // Update arrow indicator only when
        // player is still alive and is stationary
        if (mPlayer.hp > 0 && mPlayer.x === mPlayer.x_dest && mPlayer.y === mPlayer.y_dest) {
            if (this.controlManager.getIsCancelled()) {
                this.arrowIndicator.reset()
            } else if (this.controlManager.getIsUp()) {
                this.arrowIndicator.update(elapsedMS, 'up', mPlayer.getChargeRate(), blockHeight, mPlayer.energy)
            } else if (this.controlManager.getIsDown()) {
                this.arrowIndicator.update(elapsedMS, 'down', mPlayer.getChargeRate(), blockHeight, mPlayer.energy)
            } else if (this.controlManager.getIsRight()) {
                this.arrowIndicator.update(elapsedMS, 'right', mPlayer.getChargeRate(), blockWidth, mPlayer.energy)
            } else if (this.controlManager.getIsLeft()) {
                this.arrowIndicator.update(elapsedMS, 'left', mPlayer.getChargeRate(), blockWidth, mPlayer.energy)
            } else {
                // Send move request to server
                let numOfBlocks = Math.floor(this.arrowIndicator.getNumOfBlock())
                if (numOfBlocks > 0) {
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
                            this.playersContainer,
                            player_num,
                            sPlayer.id,
                            sPlayer.name,
                            sPlayer.x, 
                            sPlayer.y, 
                            sPlayer.hp, 
                            sPlayer.chargeRate,
                            sPlayer.max_hp,
                            sPlayer.x_dest, 
                            sPlayer.y_dest, 
                            sPlayer.distanceTraveled,
                            sPlayer.energy,
                            sPlayer.isCharging
                        ))
                    player_num++
                } else {
                    // Update player
                    this.players[sPlayer.id].update(
                        sPlayer.x, 
                        sPlayer.y, 
                        sPlayer.hp, 
                        sPlayer.x_dest, 
                        sPlayer.y_dest,
                        sPlayer.distanceTraveled,
                        sPlayer.energy,
                        sPlayer.isCharging
                    )
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
        for (let property in this.players) {
            this.players[property].resize(this.app.renderer.resolution)
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