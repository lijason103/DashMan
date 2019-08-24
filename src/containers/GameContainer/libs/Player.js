import * as Pixi from 'pixi.js';

// blue, red, green, orange, purple, black
const colors = [0x03A9F4, 0xf44336, 0x4CAF50, 0xFF9800, 0x9C27B0, 0x000000]

export default class Player {
    constructor(stage, num, id, x, y, hp, chargeRate, max_hp) {
        this.num = num
        this.x = x
        this.y = y
        this.id = id
        this.hp = hp
        this.max_hp = max_hp
        this.chargeRate = chargeRate

        this.graphics = new Pixi.Graphics()
        stage.addChild(this.graphics)
    }

    update(x, y, hp) {
        this.x = x
        this.y = y
        this.hp = hp
    }

    render(blockWidth, blockHeight) {
        this.graphics.clear()
        if (this.hp <= 0) return
        let diameter = blockWidth < blockHeight ? blockWidth : blockHeight
        this.graphics.lineStyle(0)
        this.graphics.beginFill(colors[this.num], 1)
        this.graphics.drawCircle(this.x * blockWidth + blockWidth/2, this.y * blockHeight + blockHeight/2, diameter/3)
        this.graphics.endFill()

        // Draw hp bar
        let hp_width = blockWidth * 0.8
        let hp_height = blockHeight * 0.1
        this.graphics.beginFill(0xDCEDC8)
        this.graphics.drawRect(this.x * blockWidth + (blockWidth - hp_width)/2, this.y * blockHeight + 3, hp_width, hp_height)
        this.graphics.endFill()
        console.log(this.max_hp)
        this.graphics.beginFill(0x4CAF50)
        this.graphics.drawRect(this.x * blockWidth + (blockWidth - hp_width)/2, this.y * blockHeight + 3, hp_width*(this.hp/this.max_hp), hp_height)
        this.graphics.endFill()
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    getHp() {
        return this.hp
    }

    getId() {
        return this.id
    }

    getChargeRate() {
        return this.chargeRate
    }
}