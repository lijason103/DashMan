import * as Pixi from 'pixi.js';
import { socket } from '../../index'

export default class Game {
    constructor() {
        this.app = new Pixi.Application({
            width: window.innerWidth * 0.8,
            height: window.innerHeight,
            backgroundColor: 0xf2fbff
        })
        this.graphics = new Pixi.Graphics()
        this.players = {}

        this.handle_game_state()
    }

    // ***** Render game *****
    
    render() {
        console.log('rendering')
        // Render players
        for (let property in this.players) {
            let player = this.players[property]
            this.graphics.lineStyle(0)
            this.graphics.beginFill(0xDE3249, 1)
            this.graphics.drawCircle(player.x, player.y, 50)
            this.graphics.endFill()
        }

        this.app.stage.addChild(this.graphics)
    }


    
    // ***** Handlers *****

    handle_game_state() {
        socket.on('IN_GAME_STATE', state => {
            this.players = state.players
            this.render()
        })
    }

    // ***** Getters *****

    getApp() {
        return this.app
    }
}