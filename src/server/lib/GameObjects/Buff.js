const Helper = require('../Helper')
const TYPES = ['ENERGY_BUFF', 'HEALTH_BUFF']

class Buff {
    constructor(x, y) {
        this.id = Buff.id
        Buff.id++
        this.x = x
        this.y = y
        
        // Generate a random buff
        this.type = TYPES[Helper.generateRandom(0, TYPES.length-1)]
    }

    activate(player) {
        if (this.type === TYPES[0]) {
            player.energy = player.max_energy
        } else if (this.type === TYPES[1]) {
            player.hp = player.max_hp
        }
    }

    getId() {
        return this.id
    }

    getType() {
        return this.type
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
