import * as Pixi from 'pixi.js';

const FONT_SIZE_REL = 0.3

export default class Buff {
    constructor(stage, blockSize, id, x, y, type) {
        this.stage = stage
        this.id = id
        this.x = x
        this.y = y
        this.type = type

        this.graphics = new Pixi.Graphics()
        this.textGraphics = new Pixi.Text('', {fontSize: blockSize*FONT_SIZE_REL})
        this.textGraphics.visible = false
        this.stage.addChild(this.graphics)
        this.stage.addChild(this.textGraphics)
    }

    render(blockSize) {
        this.graphics.clear()

        let outline = blockSize * 0.03
        let color = 0x000000
        if (this.type === 'ENERGY_BUFF' || this.type === 'HEALTH_BUFF') {
            let width = blockSize * 0.7
            let height = blockSize * 0.4
            let x = this.x * blockSize + blockSize/2 - width/2
            let y = this.y * blockSize + blockSize/2 - height/2

            let horizontalHeight = height * 0.15
            let horizontalWidth = height * 0.7
            let horizontalX = x + (width - horizontalWidth)/2
            let horizontalY = y + (height - horizontalHeight)/2

            let verticalX = x + (width - horizontalHeight)/2
            let verticalY = y + (height - horizontalWidth)/2
            if (this.type === 'ENERGY_BUFF') {
                color = 0x2196F3
            } else if (this.type === 'HEALTH_BUFF') {
                color = 0xf44336
            }
            this.graphics.beginFill(color, 1)
            this.graphics.drawRect(horizontalX, horizontalY, horizontalWidth, horizontalHeight)
            this.graphics.drawRect(verticalX, verticalY, horizontalHeight, horizontalWidth)
            this.graphics.endFill()
            this.graphics.lineStyle(outline, color, 0.5)
            this.graphics.beginFill(color, 0.3)
            this.graphics.drawRoundedRect(x, y, width, height, blockSize*0.1)
            this.graphics.endFill()

        } else {
            let x = this.x * blockSize + blockSize/2
            let y = this.y * blockSize + blockSize/2
            let radius = (blockSize * 0.5)/2
            if (this.type === 'INVINCIBILITY_BUFF') {
                color = 0xFFC107
                this.textGraphics.text = '盾'
            } else if (this.type === 'STRENGTH_BUFF') {
                color = 0xf44336
                this.textGraphics.text = '力'
            } else if (this.type === 'INVISIBILITY_BUFF') {
                color = 0x607D8B
                this.textGraphics.text = '忍'
            } else if (this.type === 'SPEED_BUFF') {
                color = 0x4CAF50
                this.textGraphics.text = '速'
            }
            this.textGraphics.x = x - this.textGraphics.width/2
            this.textGraphics.y = y - this.textGraphics.height/2
            this.textGraphics.visible = true
            this.textGraphics.style.fill = color

            this.graphics.lineStyle(outline, color, 0.5)
            this.graphics.beginFill(color, 0.3)
            this.graphics.drawCircle(x, y, radius)
            this.graphics.endFill()
        }
    }

    remove() {
        this.stage.removeChild(this.graphics)
        this.stage.removeChild(this.textGraphics)
    }

    resize(blockSize) {
        this.textGraphics.style.fontSize = blockSize*FONT_SIZE_REL
    }
}