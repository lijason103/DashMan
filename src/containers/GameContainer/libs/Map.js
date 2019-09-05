import * as Pixi from 'pixi.js';

export default class Map {
    constructor(stage, screen) {
        this.container = new Pixi.Container()
        stage.addChild(this.container)
        this.structures = null
        this.stage = stage
        this.linesGraphic = new Pixi.Graphics()
        this.container.addChild(this.linesGraphic)
        this.wallsGraphic = new Pixi.Graphics()
        this.container.addChild(this.wallsGraphic)
    }

    renderBackground(blockSize) {
        if (!this.structures) return
        // Clear
        this.linesGraphic.clear()
        this.wallsGraphic.clear()

        let width = this.structures[0].length
        let height = this.structures.length
        
        // Horizontal lines
        this.linesGraphic.lineStyle(1, 0xc1c8cc, 0.5)
        for (let i = 0; i <= height; ++i) {
            this.linesGraphic.moveTo(0, i * blockSize)
            this.linesGraphic.lineTo(width * blockSize, i * blockSize)
            this.linesGraphic.endFill()
        }
        // Vertical lines
        for (let i = 0; i <= width; ++i) {
            this.linesGraphic.moveTo(i * blockSize, 0)
            this.linesGraphic.lineTo(i * blockSize, height * blockSize)
            this.linesGraphic.endFill()
        }

        // Walls
        let wall_size = blockSize * 0.8
        let wall_gap = blockSize - wall_size
        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                if (this.structures[i][j] !== 'W') continue
                let x = j*blockSize + wall_gap/2
                let y = i*blockSize + wall_gap/2
                this.wallsGraphic.beginFill(0x9e9e9e)
                this.wallsGraphic.drawRoundedRect(x, y, wall_size, wall_size, 5)
                this.wallsGraphic.endFill()
            }
        }
    }

    isWall(x, y) {
        if (x < 0 || y < 0 || x >= this.structures[0].length || y >= this.structures.length) return true
        if (this.structures[y][x] === 'W') return true
        return false
    }

    setStructures(structures) {
        this.structures = structures
    }

    getStructureSize() {
        if (this.structures.length === 0) return null
        return {
            width: this.structures[0].length,
            height: this.structures.length
        }
    }

    isEmpty() {
        return !this.structures ? true : false
    }
}