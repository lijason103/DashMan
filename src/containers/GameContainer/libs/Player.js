import * as Pixi from 'pixi.js';
import { socket } from '../../../index'

// blue, red, green, orange, purple, brown
const colors = [0x03A9F4, 0xf44336, 0x4CAF50, 0xFF9800, 0x9C27B0, 0x795548]
const trail_size = 3
const font_size = 17

export default class Player {
    constructor(stage, num, id, name, x, y, hp, chargeRate, max_hp, x_dest, y_dest, distanceTraveled, energy) {
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

        // For graphics
        this.last_x_dest = x_dest
        this.last_y_dest = y_dest
        this.graphics = new Pixi.Graphics()
        this.trail_graphics = []
        this.textStyle = new Pixi.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontWeight: 'bold',
            fill: [socket.id === this.id ? 0x4CAF50 : 0xf44336]
        })
        this.name_graphics = new Pixi.Text(this.name, this.textStyle)
        this.name_graphics.zIndex = 1
        this.stage.addChild(this.graphics)
        this.stage.addChild(this.name_graphics)
    }

    update(x, y, hp, x_dest, y_dest, distanceTraveled, energy) {
        this.x = x
        this.y = y
        this.hp = hp
        this.x_dest = x_dest
        this.y_dest = y_dest
        this.distanceTraveled = distanceTraveled
        this.energy = energy
    }

    render(blockWidth, blockHeight) {
        this.graphics.clear()
        
        let diameter = blockWidth < blockHeight ? blockWidth : blockHeight

        if (this.x === this.x_dest && this.y === this.y_dest) {
            // Stationary
            if (this.hp > 0) {
                this.graphics.lineStyle(0)
                this.graphics.beginFill(colors[this.num], 1)
                this.graphics.drawCircle(this.x * blockWidth + blockWidth/2, this.y * blockHeight + blockHeight/2, diameter/3)
                this.graphics.endFill()
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
                let width = this.distanceTraveled * blockWidth
                if (this.x_dest > this.x) {
                    trail.drawEllipse((this.x * blockWidth) + (blockWidth/2) - width/2, this.y * blockHeight + blockHeight/2, width/2, trail_size)
                } else {
                    trail.drawEllipse((this.x * blockWidth) + (blockWidth/2) + width/2, this.y * blockHeight + blockHeight/2, width/2, trail_size)
                }
            } else if (this.y !== this.y_dest) {
                let height = this.distanceTraveled * blockHeight
                if (this.y_dest > this.y) {
                    trail.drawEllipse((this.x * blockWidth) + (blockWidth/2), (this.y * blockHeight) + (blockHeight/2) - height/2, trail_size, height/2)
                } else {
                    trail.drawEllipse((this.x * blockWidth) + (blockWidth/2), (this.y * blockHeight) + (blockHeight/2) + height/2, trail_size, height/2)
                }
            }
            trail.endFill()
        }



        if (this.hp > 0) {
            // Draw hp bar
            let hp_width = blockWidth * 0.8
            let hp_height = blockHeight * 0.1
            let hp_color, hp_color_background
            if (socket.id === this.id) {
                hp_color = 0x4CAF50
                hp_color_background = 0xDCEDC8
            } else {
                hp_color = 0xf44336
                hp_color_background = 0xffcdd2
            }
            this.graphics.lineStyle(0)
            this.graphics.beginFill(hp_color_background)
            this.graphics.drawRect(this.x * blockWidth + (blockWidth - hp_width)/2, this.y * blockHeight + 3, hp_width, hp_height)
            this.graphics.endFill()
            this.graphics.beginFill(hp_color)
            this.graphics.drawRect(this.x * blockWidth + (blockWidth - hp_width)/2, this.y * blockHeight + 3, hp_width*(this.hp/this.max_hp), hp_height)
            this.graphics.endFill()

            // Draw name
            this.name_graphics.x = this.x * blockWidth + (blockWidth - this.name_graphics.width)/2
            this.name_graphics.y = this.y * blockHeight - this.name_graphics.height
        } else {
            this.name_graphics.visible = false
        }
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

    resize(resolution) {
        this.name_graphics.style.fontSize = (font_size / resolution) + "px"
    }
}