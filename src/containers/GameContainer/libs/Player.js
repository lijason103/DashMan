import * as Pixi from 'pixi.js';
import { socket } from '../../../index'

// blue, red, green, orange, purple, brown
const colors = [0x03A9F4, 0xf44336, 0x4CAF50, 0xFF9800, 0x9C27B0, 0x795548]
const FONT_SIZE_REL = 0.3

export default class Player {
    constructor(stage, blockSize, num, id, name, x, y, hp, chargeRate, max_hp, x_dest, y_dest, distanceTraveled, energy, maxEnergy, isCharging, activeBuff) {
        this.stage = stage
        this.num = num
        this.x = x
        this.y = y
        this.id = id
        this.name = name
        this.hp = hp
        this.max_hp = max_hp
        this.chargeRate = chargeRate
        this.x_dest = x_dest
        this.y_dest = y_dest
        this.distanceTraveled = distanceTraveled
        this.energy = energy
        this.maxEnergy = maxEnergy
        this.isCharging = isCharging
        this.activeBuff = activeBuff

        // For graphics
        this.rings = []
        this.last_x_dest = x_dest
        this.last_y_dest = y_dest
        this.graphics = new Pixi.Graphics()
        this.trail_graphics = []
        this.textStyle = new Pixi.TextStyle({
            fontFamily: 'Arial',
            fontSize: blockSize * FONT_SIZE_REL,
            fill: [socket.id === this.id ? 0x4CAF50 : 0xf44336]
        })
        this.name_graphics = new Pixi.Text(this.name, this.textStyle)
        this.name_graphics.zIndex = 1
        this.stage.addChild(this.graphics)
        this.stage.addChild(this.name_graphics)
    }

    update(x, y, hp, chargeRate, x_dest, y_dest, distanceTraveled, energy, isCharging, activeBuff) {
        this.x = x
        this.y = y
        this.hp = hp
        this.chargeRate = chargeRate
        this.x_dest = x_dest
        this.y_dest = y_dest
        this.distanceTraveled = distanceTraveled
        this.energy = energy
        this.isCharging = isCharging
        this.activeBuff = activeBuff
    }

    render(blockSize) {
        this.graphics.clear()
        
        let diameter = blockSize/3
        let isInvisible = this.activeBuff && this.activeBuff.type === 'INVISIBILITY_BUFF' && this.id !== socket.id

        if (this.x === this.x_dest && this.y === this.y_dest) {
            // Stationary
            if (this.hp > 0) {
                if (!isInvisible) {
                    this.renderBuff(blockSize)
                    // Charging
                    if (this.isCharging) {
                        if (this.rings.length === 0) {
                            this.rings.push(0)
                        } else {
                            for (let i = 0; i < this.rings.length; ++i) {
                                this.rings[i] += blockSize * 0.005
                                if (this.rings[i] > diameter) {
                                    this.rings.splice(i, 1)
                                    i--
                                } else if (this.rings[i] > diameter/2 && this.rings.length < 2) {
                                    this.rings.push(0)
                                }
                            }
                        }
                    } else {
                        this.rings = []
                    }
    
                    this.graphics.lineStyle(0)
                    this.graphics.beginFill(colors[this.num], 1)
                    this.graphics.drawCircle(this.x * blockSize + blockSize/2, this.y * blockSize + blockSize/2, diameter)
                    this.graphics.endFill()
                    
                    for (let ring of this.rings) {
                        this.graphics.lineStyle(0.7, 0xffffff)
                        this.graphics.beginFill(0x000000, 0)
                        this.graphics.drawCircle(this.x * blockSize + blockSize/2, this.y * blockSize + blockSize/2, ring)
                        this.graphics.endFill()
                    }
                }
            }
            // fade the trail
            for (let i = 0; i < this.trail_graphics.length; ++i) {
                let trail = this.trail_graphics[i]
                if (trail.alpha <= 0) {
                    trail.clear()
                    trail.destroy()
                    this.trail_graphics.splice(i, 1)
                    i--
                } else {
                    trail.alpha -= 0.05
                }
            }
        } else { 
            // Moving
            let trail
            let trail_size = blockSize * 0.05
            if (this.x_dest !== this.last_x_dest || this.y_dest !== this.last_y_dest || this.trail_graphics.length === 0) {
                trail = new Pixi.Graphics()
                this.trail_graphics.push(trail)
                this.last_x_dest = this.x_dest
                this.last_y_dest = this.y_dest
                this.stage.addChild(trail)
            } else {
                trail = this.trail_graphics[this.trail_graphics.length-1]
            }
            trail.clear()
            trail.lineStyle(1, colors[this.num], 0.5)
            trail.beginFill(0xffffff, 1)
            if (this.x !== this.x_dest) {
                let width = this.distanceTraveled * blockSize
                let trail_y = this.y * blockSize + blockSize/2
                if (this.x_dest > this.x) {
                    trail.drawEllipse((this.x * blockSize) + (blockSize/2) - width/2, trail_y, width/2, trail_size)
                } else {
                    trail.drawEllipse((this.x * blockSize) + (blockSize/2) + width/2, trail_y, width/2, trail_size)
                }
            } else if (this.y !== this.y_dest) {
                let height = this.distanceTraveled * blockSize
                let trail_x = (this.x * blockSize) + (blockSize/2)
                if (this.y_dest > this.y) {
                    trail.drawEllipse(trail_x, (this.y * blockSize) + (blockSize/2) - height/2, trail_size, height/2)
                } else {
                    trail.drawEllipse(trail_x, (this.y * blockSize) + (blockSize/2) + height/2, trail_size, height/2)
                }
            }
            trail.endFill()
        }



        if (this.hp > 0 && !isInvisible) {
            // Draw hp bar
            let hp_width = blockSize * 0.9
            let hp_height = blockSize * 0.1
            let hp_color, hp_color_background
            let hp_x = this.x * blockSize + (blockSize - hp_width)/2
            let hp_y = this.y * blockSize
            if (socket.id === this.id) {
                hp_color = 0x4CAF50
                hp_color_background = 0xDCEDC8
            } else {
                hp_color = 0xf44336
                hp_color_background = 0xffcdd2
            }
            this.graphics.lineStyle(0)
            this.graphics.beginFill(hp_color_background)
            this.graphics.drawRect(hp_x, hp_y, hp_width, hp_height)
            this.graphics.endFill()
            this.graphics.beginFill(hp_color)
            this.graphics.drawRect(hp_x, hp_y, hp_width*(this.hp/this.max_hp), hp_height)
            this.graphics.endFill()

            // Draw name
            this.name_graphics.x = this.x * blockSize + (blockSize - this.name_graphics.width)/2
            this.name_graphics.y = this.y * blockSize - this.name_graphics.height
            this.name_graphics.visible = true
        } else {
            this.name_graphics.visible = false
        }
    }

    renderBuff(blockSize) {
        if (!this.activeBuff) return
        let diameter = blockSize * 0.5
        let outline = blockSize * 0.03
        let x = this.x * blockSize + blockSize/2
        let y = this.y * blockSize + blockSize/2
        let color
        if (this.activeBuff.type === 'INVINCIBILITY_BUFF') {
            color = 0xFFC107
        } else if (this.activeBuff.type === 'STRENGTH_BUFF') {
            color = 0xf44336
        } else if (this.activeBuff.type === 'INVISIBILITY_BUFF') {
            color = 0x607D8B
        } else if (this.activeBuff.type === 'SPEED_BUFF') {
            color = 0x4CAF50
        }
        this.graphics.lineStyle(outline, color, 0.5)
        this.graphics.beginFill(color, 0.3)
        this.graphics.drawCircle(x, y, diameter)
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

    getEnergy() {
        return this.energy
    }

    getMaxEnergy() {
        return this.maxEnergy
    }

    getXDest() {
        return this.x_dest
    }

    getYDest() {
        return this.y_dest
    }

    resize(blockSize) {
        this.name_graphics.style.fontSize = blockSize * FONT_SIZE_REL
    }
}