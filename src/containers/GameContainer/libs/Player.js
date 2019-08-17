import * as Pixi from 'pixi.js';

export default class Player {
    constructor(stage, id, x, y, hp) {
        this.x = x
        this.y = y
        this.id = id
        this.hp = hp

        this.graphics = new Pixi.Graphics()
        stage.addChild(this.graphics)

    }

    update(x, y, hp) {
        this.x = x
        this.y = y
        this.hp = hp
    }

    render() {
        this.graphics.clear()
        this.graphics.lineStyle(0)
        this.graphics.beginFill(0xDE3249, 1)
        this.graphics.drawCircle(this.x, this.y, 50)
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
}