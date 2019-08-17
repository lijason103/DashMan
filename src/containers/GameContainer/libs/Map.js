import * as Pixi from 'pixi.js';

export default class Map {
    constructor(stage, width, height, winWidth, winHeight) {
        this.width = width // Number of block horizontally
        this.height = height // Number of block vertically
        this.winWidth = winWidth
        this.winHeight = winHeight

        this.renderBackground(stage)
    }

    renderBackground(stage) {
        this.horizontalLines = []
        this.verticalLines = []
        
        // Horizontal lines
        for (let i = 0; i < this.height; ++i) {
            let line = new Pixi.Graphics()
            let block_size = this.getBlockHeight()
            line.lineStyle(1, 0xc1c8cc, 1)
            line.moveTo(0, i * block_size)
            line.lineTo(this.winWidth, i * block_size)
            this.horizontalLines.push(line)
            stage.addChild(line)
        }
        // Vertical lines
        for (let i = 0; i < this.width; ++i) {
            let line = new Pixi.Graphics()
            let block_size = this.getBlockWidth()
            line.lineStyle(1, 0xc1c8cc, 1)
            line.moveTo(i * block_size, 0)
            line.lineTo(i * block_size, this.winHeight)
            this.verticalLines.push(line)
            stage.addChild(line)
        }
    }

    render() {
    }

    getBlockWidth() {
        return this.winWidth/this.width
    }

    getBlockHeight() {
        return this.winHeight/this.height
    }
}