import nipplejs from 'nipplejs'
import Keyboard from './Keyboard'

const forceThresh = 0.7

export default class ControlManager {
    constructor(id) {
        // Callbacks
        this.onCancelledCallback = null
        this.onReachedThreshCallback = null
        this.onChangeDirectionCallback = null

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
                    if (this.onCancelledCallback) this.onCancelledCallback()
                } else if (this.joystick_force >= forceThresh) {
                    this.isCancelled = false
                } else if (this.joystick_force < forceThresh && data.force >= forceThresh) {
                    if (this.onReachedThreshCallback) this.onReachedThreshCallback()
                }
                this.joystick_angle = data.direction.angle
                this.joystick_force = data.force
            }
        })
        this.joystickManager.on('end', (evt, data) => {
            if (this.onCancelledCallback) this.onCancelledCallback()
            this.joystick_angle = null
            this.joystick_force = 0
            this.isCancelled = false
        })
        this.joystickManager.on('dir', (evt, data) => {
            if (data.force >= forceThresh && this.joystick_angle !== data.direction.angle) {
                if (this.onChangeDirectionCallback) this.onChangeDirectionCallback()
            }
        })

        // Keyboard
        this.upKey = Keyboard('ArrowUp')
        this.downKey = Keyboard('ArrowDown')
        this.rightKey = Keyboard('ArrowRight')
        this.leftKey = Keyboard('ArrowLeft')
    }

    setOnCancelledCallback(onCancelledCallback) {
        this.onCancelledCallback = onCancelledCallback
    }

    setOnReachedThreshCallback(onReachedThreshCallback) {
        this.onReachedThreshCallback = onReachedThreshCallback
    }

    setOnChangeDirectionCallback(onChangeDirectionCallback) {
        this.onChangeDirectionCallback = onChangeDirectionCallback
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