import * as Pixi from 'pixi.js';

const FONT_SIZE_REL = 0.4

export default class TimeIndicator {
    constructor(stage) {
        this.gameTime = 0
        this.graphics = new Pixi.Graphics()
        this.textGraphic = new Pixi.Text('0', {
            fill: 0xffffff
        })
        this.textGraphic.text = 0
        this.textGraphic.visible = false
        stage.addChild(this.graphics)
        stage.addChild(this.textGraphic)

        this.screenWidth = 0
    }

    render(blockSize) {
        this.graphics.clear()
        let width = 2*blockSize
        let height = blockSize*0.6
        let x = this.screenWidth/2 - width/2
        let y = blockSize*0.2
        this.textGraphic.text = (this.gameTime/1000).toFixed(0)
        this.textGraphic.x = x + width/2 - this.textGraphic.width/2
        this.textGraphic.y = y + height/2 - this.textGraphic.height/2
        this.graphics.beginFill(0x000000, 0.7)
        this.graphics.drawRoundedRect(x, y, width, height, blockSize*0.2)
        this.graphics.endFill()
    }

    setGameTime(gameTime) {
        this.gameTime = gameTime
    }

    resize(blockSize, screenWidth) {
        this.textGraphic.style.fontSize = blockSize * FONT_SIZE_REL
        this.textGraphic.visible = true
        this.screenWidth = screenWidth
    }
}