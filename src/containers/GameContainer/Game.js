import * as Pixi from 'pixi.js';
import { socket } from '../../index'

import ControlManager from './libs/ControlManager'
import Player from './libs/Player'
import ArrowIndicator from './libs/ArrowIndicator'
import Map from './libs/Map'
import Buff from './libs/Buff'
import TimeIndicator from './libs/TimeIndicator'

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.app = new Pixi.Application({
            width: gameWidth,
            height: gameHeight,
            backgroundColor: 0xf2fbff,
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio,
            autoResize: true,
        })
        this.players = {}
        this.blockSize = 0

        // Map
        this.map = new Map(this.app.stage)

        // Arrow Indicator
        this.arrowIndicatorContainer = new Pixi.Container()
        this.app.stage.addChild(this.arrowIndicatorContainer)
        this.arrowIndicator = new ArrowIndicator(this.arrowIndicatorContainer)

        // Players
        this.playersContainer = new Pixi.Container()
        this.app.stage.addChild(this.playersContainer)

        // Buffs
        this.buffs = {}
        this.buffsContainer = new Pixi.Container()
        this.app.stage.addChild(this.buffsContainer)

        // Time
        this.timeIndicatorContainer = new Pixi.Container()
        this.app.stage.addChild(this.timeIndicatorContainer)
        this.timeIndicator = new TimeIndicator(this.timeIndicatorContainer)

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
            let mPlayer = this.players[socket.id]
            if (mPlayer && mPlayer.isCharging) {
                socket.emit('STOP_CHARGE', {})
            }
        })
        this.controlManager.setOnReachedThreshCallback(() => {
            socket.emit('START_CHARGE', {})
        })
        this.controlManager.setOnChangeDirectionCallback(() => {
            // socket.emit('STOP_CHARGE', {})
            // setTimeout(() => socket.emit('START_CHARGE', {}), 200)
        })
    }

    // ***** Render game *****

    render() {
        let mPlayer = this.players[socket.id]

        // Render players
        let blockSize = this.blockSize
        for (let id in this.players) {
            if (this.players.hasOwnProperty(id)) {
                let player = this.players[id]
                player.render(blockSize)
            }
        }

        // Render Arrow
        if (mPlayer) {
            this.arrowIndicator.render(mPlayer.getX(), mPlayer.getY(), blockSize, mPlayer.getHp() <= 0)
        }

        // Render Buffs
        for (let property in this.buffs) {
            this.buffs[property].render(blockSize)
        }

        // Render timer
        this.timeIndicator.render(blockSize)
    }

    gameLoop(deltaMS) {
        let elapsedMS = this.app.ticker.elapsedMS
        if (this.map.isEmpty()) return
        this.render()
        let mPlayer = this.players[socket.id]
        let blockSize = this.blockSize

        // Update arrow indicator only when
        if (mPlayer.hp > 0 && this.timeIndicator.isGameStarted() && mPlayer.x === mPlayer.x_dest && mPlayer.y === mPlayer.y_dest) {
            if (this.controlManager.getIsCancelled()) {
                this.arrowIndicator.reset()
            } else if (this.controlManager.getIsUp()) {
                this.arrowIndicator.update(elapsedMS, 'up', mPlayer.getChargeRate(), blockSize, mPlayer.energy)
            } else if (this.controlManager.getIsDown()) {
                this.arrowIndicator.update(elapsedMS, 'down', mPlayer.getChargeRate(), blockSize, mPlayer.energy)
            } else if (this.controlManager.getIsRight()) {
                this.arrowIndicator.update(elapsedMS, 'right', mPlayer.getChargeRate(), blockSize, mPlayer.energy)
            } else if (this.controlManager.getIsLeft()) {
                this.arrowIndicator.update(elapsedMS, 'left', mPlayer.getChargeRate(), blockSize, mPlayer.energy)
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
                this.blockSize = this.calculateBlockSize(this.map.getStructureSize())
                this.app.stage.x += this.getHorizontalPadding()
                this.app.stage.y += this.getVerticalPadding()
                this.map.renderBackground(this.blockSize)
                this.timeIndicator.resize(this.blockSize, this.map.getStructureSize().width * this.blockSize)
            }
            let player_num = 0
            for (let property in state.players) {
                let sPlayer = state.players[property]
                if (!this.players.hasOwnProperty(sPlayer.id)) {
                    // New player
                    this.players[sPlayer.id] = (
                        new Player(
                            this.playersContainer,
                            this.blockSize,
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
                        sPlayer.chargeRate,
                        sPlayer.x_dest, 
                        sPlayer.y_dest,
                        sPlayer.distanceTraveled,
                        sPlayer.energy,
                        sPlayer.isCharging,
                        sPlayer.activeBuff,
                    )
                }
            }

            // Add new buffs to the map
            for (let property in state.map.buffs) {
                if (!this.buffs.hasOwnProperty(property)) {
                    let buff = state.map.buffs[property]
                    this.buffs[buff.id] = new Buff(this.buffsContainer, this.blockSize, buff.id, buff.x, buff.y, buff.type)
                }
            }
            // Remove old buffs from the map
            for (let property in this.buffs) {
                if (!state.map.buffs.hasOwnProperty(property)) {
                    this.buffs[property].remove()
                    delete this.buffs[property]
                }
            }
            // Time
            this.timeIndicator.setGameTime(state.gameTime)
            this.timeIndicator.setCountDownTime(state.startCountDownTime)
        })
    }

    // Helpers
    calculateBlockSize(structureSize) {
        let size
        if (this.app.screen.width < this.app.screen.height) {
            size = this.app.screen.width/structureSize.width
        } else {
            // TODO: Find a better way to calculate the block size in landscape mode
            // This is a terrible way to solve it
            // This is required because the ratio for iPad is messed...
            size = this.app.screen.height/structureSize.height
            while (size * structureSize.width > this.app.screen.width) {
                size -= 1
            }
        }
        return size
    }

    getVerticalPadding() {
        let structureSize = this.map.getStructureSize()
        if (!structureSize) return 0
        return (this.app.screen.height - (this.blockSize * structureSize.height))/2
    }

    getHorizontalPadding() {
        let structureSize = this.map.getStructureSize()
        if (!structureSize) return 0        
        return (this.app.screen.width - (this.blockSize * structureSize.width))/2
    }

    resize(width, height) {
        this.app.renderer.resize(width, height)
        if (!this.map.isEmpty()) {
            this.blockSize = this.calculateBlockSize(this.map.getStructureSize())
            this.app.stage.x = this.getHorizontalPadding()
            this.app.stage.y = this.getVerticalPadding()
            this.map.renderBackground(this.blockSize)
        }
        for (let property in this.players) {
            this.players[property].resize(this.blockSize)
        }
        for (let property in this.buffs) {
            this.buffs[property].resize(this.blockSize)
        }
        this.timeIndicator.resize(this.blockSize, this.map.getStructureSize().width * this.blockSize)
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