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
        let x = this.x * blockSize + blockSize/2
        let y = this.y * blockSize + blockSize/2
        let radius = (blockSize * 0.5)/2
        let outline = blockSize * 0.03
        if (this.type === 'ENERGY_BUFF' || this.type === 'HEALTH_BUFF') {
            let horizontalHeight = radius * 0.15
            let horizontalWidth = radius * 0.9
            let horizontalX = x - horizontalWidth/2
            let horizontalY = y - horizontalHeight/2

            let verticalX = x - horizontalHeight/2
            let verticalY = y - horizontalWidth/2
            let color
            if (this.type === 'ENERGY_BUFF') {
                color = 0x2196F3
            } else if (this.type === 'HEALTH_BUFF') {
                color = 0x4CAF50
            }
            this.graphics.beginFill(color, 1)
            this.graphics.drawRect(horizontalX, horizontalY, horizontalWidth, horizontalHeight)
            this.graphics.drawRect(verticalX, verticalY, horizontalHeight, horizontalWidth)
            this.graphics.endFill()
            this.graphics.lineStyle(outline, color, 0.5)
            this.graphics.beginFill(color, 0.3)
            this.graphics.drawCircle(x, y, radius)
            this.graphics.endFill()

        } else if (this.type === 'INVINCIBILITY_BUFF' || this.type === 'STRENGTH_BUFF') {
            let color = 0xFFC107
            if (this.type === 'INVINCIBILITY_BUFF') {
                color = 0xFFC107
                this.textGraphics.text = '盾'
            } else if (this.type === 'STRENGTH_BUFF') {
                color = 0x4CAF50
                this.textGraphics.text = '力'
            }
            // let leftX = x - radius*0.4
            // let rightX = x + radius*0.4
            // let topY = y - radius*0.4
            // let midY = y + radius*0.3
            // let botY = y + radius*0.6
            // this.graphics.beginFill(color, 1)
            // this.graphics.moveTo(leftX, topY) // topleft
            // this.graphics.lineTo(rightX, topY) // topright
            // this.graphics.lineTo(rightX, midY) // midright
            // this.graphics.lineTo(x, botY) // botmid
            // this.graphics.lineTo(leftX, midY) // midleft
            // this.graphics.endFill()
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