import nipplejs from 'nipplejs'
import Keyboard from './Keyboard'

const forceThresh = 1

export default class ControlManager {
    constructor(id) {
        // Joystick
        this.joystick_angle = null
        this.joystick_force = 0
        this.isCancelled = false
        this.joystickManager = nipplejs.create({
            zone: document.getElementById(id),
            mode: 'dynamic',
            color: 'black',
        })
        this.joystickManager.on('move', (evt, data) => {
            if (data.direction) {
                if (data.force < forceThresh && this.joystick_force >= forceThresh) {
                    this.isCancelled = true
                } else if (this.joystick_force >= forceThresh) {
                    this.isCancelled = false
                }
                this.joystick_angle = data.direction.angle
                this.joystick_force = data.force
            }
        })
        this.joystickManager.on('end', (evt, data) => {
            this.joystick_angle = null
            this.joystick_force = 0
            this.isCancelled = false
        })

        // Keyboard
        this.upKey = Keyboard('ArrowUp')
        this.downKey = Keyboard('ArrowDown')
        this.rightKey = Keyboard('ArrowRight')
        this.leftKey = Keyboard('ArrowLeft')
    }
    
    getIsUp() {
        if ((this.joystick_angle === 'up' && this.joystick_force >= forceThresh) || this.upKey.isDown) {
            return true
        }
        return false
    }

    getIsDown() {
        if ((this.joystick_angle === 'down' && this.joystick_force >= forceThresh) || this.downKey.isDown) {
            return true
        }
        return false
    }


    getIsLeft() {
        if ((this.joystick_angle === 'left' && this.joystick_force >= forceThresh) || this.leftKey.isDown) {
            return true
        }
        return false
    }

    getIsRight() {
        if ((this.joystick_angle === 'right' && this.joystick_force >= forceThresh) || this.rightKey.isDown) {
            return true
        }
        return false
    }

    getIsCancelled() {
        return this.isCancelled
    }

    destroy() {
        this.joystickManager.destroy()
        this.upKey.unsubscribe()
        this.downKey.unsubscribe()
        this.rightKey.unsubscribe()
        this.leftKey.unsubscribe()
    }
}