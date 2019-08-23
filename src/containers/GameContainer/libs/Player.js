import * as Pixi from 'pixi.js';

export default class Player {
    constructor(stage, id, x, y, hp, chargeRate) {
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
        console.log(this.hp)
        if (this.hp <= 0) return
        let diameter = blockWidth < blockHeight ? blockWidth : blockHeight
        this.graphics.lineStyle(0)
        this.graphics.beginFill(0xDE3249, 1)
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