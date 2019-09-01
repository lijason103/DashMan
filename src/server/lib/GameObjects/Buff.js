const Helper = require('../Helper')
const ONE_TIME_TYPES = ['ENERGY_BUFF', 'HEALTH_BUFF']
const DURATION_TYPES = ['INVINCIBILITY_BUFF']
const DURATION_TIME = 10 //s

class Buff {
    constructor(x, y) {
        this.id = Buff.id
        Buff.id++
        this.x = x
        this.y = y
        
        // Generate a random buff
        this.expiryDate = null
        this.isDurationBuff = Helper.generateRandom(0, 1) === 1
        if (this.isDurationBuff) {
            this.type = DURATION_TYPES[Helper.generateRandom(0, DURATION_TYPES.length-1)]
        } else {
            this.type = ONE_TIME_TYPES[Helper.generateRandom(0, ONE_TIME_TYPES.length-1)]
        }
    }

    activate(player) {
        if (this.isDurationBuff) {
            // Duration type
            if (this.type === DURATION_TYPES[0]) {  // Invincibility
                player.activeBuff = this
            }
            this.expiryDate = new Date()
            this.expiryDate.setSeconds(this.expiryDate.getSeconds() + DURATION_TIME)
        } else {
            // One-time type
            if (this.type === ONE_TIME_TYPES[0]) {      // Energy buff
                player.energy = player.max_energy
            } else if (this.type === ONE_TIME_TYPES[1]) {   // Health buff
                player.hp = player.max_hp
            }
        }

    }

    isExpired(currentTime) {
        return currentTime > this.expiryDate
    }

    getId() {
        return this.id
    }

    getType() {
        return this.type
    }

    getDurationAll() {
        return {
            id: this.id,
            expiryDate: this.expiryDate,
            type: this.type
        }
    }

    getAll() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            type: this.type
        }
    }
}
// TODO: Maybe move this somewhere else because the buffs from different game room is also sharing the same static id
Buff.id = 1
module.exports = Buff
