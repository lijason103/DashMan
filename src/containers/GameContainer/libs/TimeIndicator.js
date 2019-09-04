import * as Pixi from 'pixi.js';

const FONT_SIZE_REL = 0.4
const COUNT_DOWN_FONT_SIZE_REL = 1.2
const COUNT_DOWN_STROKE_REL = 0.1

export default class TimeIndicator {
    constructor(stage) {
        this.stage = stage

        this.gameTime = 0
        this.graphics = new Pixi.Graphics()
        this.textGraphic = new Pixi.Text('0', {
            fill: 0xffffff
        })
        this.textGraphic.text = 0
        this.textGraphic.visible = false
        this.stage.addChild(this.graphics)
        this.stage.addChild(this.textGraphic)

        this.screenWidth = 0

        this.countDownTextGraphic = new Pixi.Text('0', {
            fill: [0xFFEB3B, 0xFF9800, 0xFFEB3B],
        })
        this.countDownTextGraphic.text = 0
        this.countDownTextGraphic.visible = false
        this.countDownTime = 999
        this.stage.addChild(this.countDownTextGraphic)
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

        // Game start count down
        if (this.countDownTime > 0) {
            this.countDownTextGraphic.visible = true
            this.countDownTextGraphic.text = 'READY?'
            this.countDownTextGraphic.x = this.screenWidth/2 - this.countDownTextGraphic.width/2
            this.countDownTextGraphic.y = blockSize * 4 - this.countDownTextGraphic.height/2
        } else if (this.countDownTextGraphic) {
            this.countDownTextGraphic.text = 'GO!'
            this.countDownTextGraphic.x = this.screenWidth/2 - this.countDownTextGraphic.width/2
            this.countDownTextGraphic.y = blockSize * 4 - this.countDownTextGraphic.height/2
            this.countDownTextGraphic.alpha -= 0.01
            if (this.countDownTextGraphic.alpha <= 0) this.stage.removeChild(this.countDownTextGraphic)
        }
    }

    isGameStarted() {
        return this.countDownTime <= 0
    }

    setCountDownTime(countDownTime) {
        this.countDownTime = countDownTime
    }

    setGameTime(gameTime) {
        this.gameTime = gameTime
    }

    resize(blockSize, screenWidth) {
        this.textGraphic.style.fontSize = blockSize * FONT_SIZE_REL
        this.textGraphic.visible = true
        this.screenWidth = screenWidth

        this.countDownTextGraphic.style.fontSize = blockSize * COUNT_DOWN_FONT_SIZE_REL
        this.countDownTextGraphic.style.strokeThickness = blockSize * COUNT_DOWN_STROKE_REL
    }
}