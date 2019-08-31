import * as Pixi from 'pixi.js';

export default class ArrowIndicator {
    constructor(stage) {
        this.length = 0
        this.direction = null
        this.graphics = new Pixi.Graphics()
        this.numOfBlock = 0 // the number of blocks that the line has reached
        stage.addChild(this.graphics)
    }

    render(x, y, blockSize) {
        let size = blockSize * 0.2
        let startX = x * blockSize + blockSize/2
        let startY = y * blockSize + blockSize/2
        this.graphics.clear()
        if (this.direction) {
            this.graphics.beginFill(0x76FF03, 0.4);
            if (this.direction === 'up'){
                this.graphics.drawRect(startX - size/2, startY - this.length + blockSize/2, size, this.length - blockSize/2)
            } else if (this.direction === 'down') {
                this.graphics.drawRect(startX - size/2, startY, size, this.length - blockSize/2)
            } else if (this.direction === 'left') {
                this.graphics.drawRect(startX - this.length + blockSize/2, startY - size/2, this.length - blockSize/2, size)
            } else if (this.direction === 'right') {
                this.graphics.drawRect(startX, startY - size/2, this.length - blockSize/2, size)
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