import * as Pixi from 'pixi.js';

export default class EnergyBar {
    constructor(stage) {
        this.energy = 1
        this.energyMax = 1
        this.screenWidth = 0
        this.screenHeight = 0

        this.graphics = new Pixi.Graphics()
        stage.addChild(this.graphics)
    }

    render(blockSize) {
        this.graphics.clear()
        
        let width = 5*blockSize
        let height = blockSize*0.6
        let x = this.screenWidth/2 - width/2
        let y = this.screenHeight - height/2 - blockSize*0.4

        let energyWidth = this.energy/this.energyMax * width

        // Draw background
        this.graphics.beginFill(0x000000, 0.7)
        this.graphics.drawRoundedRect(x, y, width, height, blockSize*0.05)
        this.graphics.endFill()

        // Draw energy
        this.graphics.beginFill(0x2196F3, 0.7)
        this.graphics.drawRoundedRect(x, y, energyWidth, height, blockSize*0.05)
        this.graphics.endFill()
    }

    updateEnergy(energy, energyMax) {
        this.energy = energy
        this.energyMax = energyMax
    }

    resize(blockSize, screenWidth, screenHeight) {
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
    }
}