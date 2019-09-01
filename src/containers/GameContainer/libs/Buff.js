import * as Pixi from 'pixi.js';

export default class Buff {
    constructor(stage, id, x, y, type) {
        this.stage = stage
        this.id = id
        this.x = x
        this.y = y
        this.type = type

        this.graphics = new Pixi.Graphics()
        this.stage.addChild(this.graphics)
    }

    render(blockSize) {
        this.graphics.clear()
        let x = this.x * blockSize + blockSize/2
        let y = this.y * blockSize + blockSize/2
        let radius = (blockSize * 0.8)/2
        let outline = blockSize * 0.03
        if (this.type === 'ENERGY_BUFF' || this.type === 'HEALTH_BUFF') {
            let horizontalHeight = blockSize * 0.1
            let horizontalWidth = blockSize * 0.5
            let horizontalX = x - horizontalWidth/2
            let horizontalY = y - horizontalHeight/2

            let verticalX = x - horizontalHeight/2
            let verticalY = y - horizontalWidth/2
            let color
            if (this.type === 'ENERGY_BUFF') {
                color = 0x2196F3
            } else if (this.type === 'HEALTH_BUFF') {
                color = 0xf44336
            }
            this.graphics.lineStyle(outline, color, 0.3)
            this.graphics.beginFill(color, 0.1)
            this.graphics.drawCircle(x, y, radius)
            this.graphics.beginFill(color, 0.8)
            this.graphics.drawRect(horizontalX, horizontalY, horizontalWidth, horizontalHeight)
            this.graphics.drawRect(verticalX, verticalY, horizontalHeight, horizontalWidth)
            this.graphics.endFill()
        }
    }

    remove() {
        this.stage.removeChild(this.graphics)
    }
}