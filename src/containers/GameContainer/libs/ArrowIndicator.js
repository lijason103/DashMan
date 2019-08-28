import * as Pixi from 'pixi.js';

export default class ArrowIndicator {
    constructor(stage) {
        this.length = 0
        this.direction = null
        this.line = new Pixi.Graphics()
        this.numOfBlock = 0 // the number of blocks that the line has reached
        stage.addChild(this.line)
    }

    render(startX, startY) {
        this.line.clear()
        if (this.direction) {
            this.line.lineStyle(2, 0xf44336, 1)
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

    update(elapsedMS, direction, chargeRate, blockSize, currentEnergy) {
        let addLength = elapsedMS * chargeRate * (blockSize/1000)
        if (direction !== this.direction) {
            this.length = addLength
            this.direction = direction
        } else {
            // only allow to increase the length if there is enough energy
            if ((this.length + addLength) / blockSize <= currentEnergy) {
                this.length += addLength
                this.numOfBlock = this.length / blockSize
            }
        }
    }

    reset() {
        this.length = 0
        this.direction = null
        this.numOfBlock = 0
    }

    // Get the number of blocks that the indicator has reached
    getNumOfBlock() {
        return this.numOfBlock
    }

    getDirection() {
        return this.direction
    }
}