import * as Pixi from 'pixi.js';

// blue, red, green, orange, purple, black
const colors = [0x03A9F4, 0xf44336, 0x4CAF50, 0xFF9800, 0x9C27B0, 0x000000]

export default class Player {
    constructor(stage, num, id, x, y, hp, chargeRate) {
        this.num = num
        this.x = x
        this.y = y
        this.id = id
        this.hp = hp
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
        this.graphics.drawCircle(this.x * blockWidth + blockWidth/2, this.y * blockHeight + blockHeight/2, diameter/2)
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