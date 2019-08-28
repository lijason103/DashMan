import * as Pixi from 'pixi.js';

export default class Map {
    constructor(stage, winWidth, winHeight) {
        this.structures = null
        this.winWidth = winWidth // Device window width
        this.winHeight = winHeight // Device window height
        this.stage = stage
        this.horizontalLines = []
        this.verticalLines = []
        this.wallRectangles = []
    }

    renderBackground() {
        if (!this.structures) return
        // Clear
        for (let line of this.horizontalLines) {
            line.clear()
        }
        for (let line of this.verticalLines) {
            line.clear()
        }
        for (let rectangle of this.wallRectangles) {
            rectangle.clear()
        }


        let width = this.structures[0].length
        let height = this.structures.length
        let blockHeight = this.getBlockHeight()
        let blockWidth = this.getBlockWidth()
        
        // Horizontal lines
        for (let i = 0; i < height; ++i) {
            let line = new Pixi.Graphics()
            line.zIndex = -10
            line.lineStyle(1, 0xc1c8cc, 1)
            line.moveTo(0, i * blockHeight)
            line.lineTo(this.winWidth, i * blockHeight)
            this.horizontalLines.push(line)
            this.stage.addChild(line)
        }
        // Vertical lines
        for (let i = 0; i < width; ++i) {
            let line = new Pixi.Graphics()
            line.zIndex = -10
            line.lineStyle(1, 0xc1c8cc, 1)
            line.moveTo(i * blockWidth, 0)
            line.lineTo(i * blockWidth, this.winHeight)
            this.verticalLines.push(line)
            this.stage.addChild(line)
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
                rectangle.drawRoundedRect(j*blockWidth + wall_gap_width/2, i*blockHeight + wall_gap_height/2, wall_blockWidth, wall_blockHeight, 5)
                rectangle.endFill()
                this.wallRectangles.push(rectangle)
                this.stage.addChild(rectangle)
            }
        }
    }

    render() {
    }

    setStructures(structures) {
        this.structures = structures
        this.renderBackground()
    }

    getBlockWidth() {
        return this.winWidth/this.structures[0].length
    }

    getBlockHeight() {
        return this.winHeight/this.structures.length
    }

    isEmpty() {
        return !this.structures ? true : false
    }
}