import * as Pixi from 'pixi.js';

export default class Map {
    constructor(stage, structures, winWidth, winHeight) {
        this.structures = structures
        this.winWidth = winWidth // Device window width
        this.winHeight = winHeight // Device window height

        this.renderBackground(stage)
    }

    renderBackground(stage) {
        this.horizontalLines = []
        this.verticalLines = []
        let width = this.structures[0].length
        let height = this.structures.length
        let blockHeight = this.getBlockHeight()
        let blockWidth = this.getBlockWidth()
        
        // Horizontal lines
        for (let i = 0; i < height; ++i) {
            let line = new Pixi.Graphics()
            line.lineStyle(1, 0xc1c8cc, 1)
            line.moveTo(0, i * blockHeight)
            line.lineTo(this.winWidth, i * blockHeight)
            this.horizontalLines.push(line)
            stage.addChild(line)
        }
        // Vertical lines
        for (let i = 0; i < width; ++i) {
            let line = new Pixi.Graphics()
            line.lineStyle(1, 0xc1c8cc, 1)
            line.moveTo(i * blockWidth, 0)
            line.lineTo(i * blockWidth, this.winHeight)
            this.verticalLines.push(line)
            stage.addChild(line)
        }

        // Walls
        let wall_blockWidth = blockWidth * 0.8
        let wall_gap_width = blockWidth - wall_blockWidth
        let wall_blockHeight = blockHeight * 0.8
        let wall_gap_height = blockHeight - wall_blockHeight
        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                if (this.structures[i][j] !== 'W') continue
                let rectangle = new Pixi.Graphics()
                rectangle.beginFill(0x9e9e9e)
                rectangle.drawRoundedRect(j*blockWidth + wall_gap_width/2, i*blockHeight + wall_gap_height/2, wall_blockWidth, wall_blockHeight, 10)
                rectangle.endFill()
                stage.addChild(rectangle)
            }
        }
    }

    render() {
    }

    getBlockWidth() {
        return this.winWidth/this.structures[0].length
    }

    getBlockHeight() {
        return this.winHeight/this.structures.length
    }
}