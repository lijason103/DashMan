import * as Pixi from 'pixi.js';

export default class ArrowIndicator {
    constructor(stage) {
        this.length = 0
        this.direction = null
        this.line = new Pixi.Graphics()
        stage.addChild(this.line)
    }

    render(startX, startY) {
        this.line.clear()
        if (this.direction) {
            this.line.lineStyle(2, 0xFF00FF, 0.5)
            this.line.moveTo(startX, startY)
            if (this.direction === 'up'){
                this.line.lineTo(startX, startY - this.length)
            } else if (this.direction === 'down') {
                this.line.lineTo(startX, startY + this.length)
            } else if (this.direction === 'left') {
                this.line.lineTo(startX - this.length , startY)
            } else if (this.direction === 'right') {
                this.line.lineTo(startX + this.length, startY)
            }
        }
    }

    update(direction, deltaLength) {
        if (direction !== this.direction) {
            this.length = deltaLength
            this.direction = direction
        } else {
            this.length += deltaLength
        }
    }

    reset() {
        this.length = 0
        this.direction = null
    }

}