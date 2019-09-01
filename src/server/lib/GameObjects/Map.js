const Helper = require('../Helper')
const Buff = require('./Buff')

const GROD = 'G' // Ground
const WALL = 'W'
const BUFF = 'BUFF'
const MAX_BUFFS = 6

class Map {
    constructor() {
        // 19 x 10
        this.structures = 
        [
            [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
            [WALL, GROD, GROD, GROD, GROD, GROD, WALL, GROD, GROD, GROD, GROD, GROD, WALL, GROD, GROD, GROD, GROD, GROD, WALL],
            [WALL, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, WALL],
            [WALL, WALL, GROD, GROD, GROD, GROD, GROD, WALL, GROD, GROD, GROD, WALL, GROD, GROD, GROD, GROD, GROD, WALL, WALL],
            [WALL, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, WALL],
            [WALL, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, WALL],
            [WALL, WALL, GROD, GROD, GROD, GROD, GROD, WALL, GROD, GROD, GROD, WALL, GROD, GROD, GROD, GROD, GROD, WALL, WALL],
            [WALL, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, GROD, WALL],
            [WALL, GROD, GROD, GROD, GROD, GROD, WALL, GROD, GROD, GROD, GROD, GROD, WALL, GROD, GROD, GROD, GROD, GROD, WALL],
            [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
        ]

        this.buffs = {}
    }

    generateBuff() {
        if (Object.keys(this.buffs).length >= MAX_BUFFS) return

        // Randomly select an empty spot
        let row, column
        do {
            row = Helper.generateRandom(0, this.getHeight() - 1)
            column = Helper.generateRandom(0, this.getWidth() - 1)
        } while (this.structures[row][column] !== GROD)
        let newBuff = new Buff(column, row)
        this.buffs[newBuff.getId()] = newBuff
        this.structures[row][column] = `${BUFF}${newBuff.getId()}`
    }

    getBuff(x, y) {
        if (this.structures[y][x].startsWith(BUFF)) {
            let id = this.structures[y][x].substring(BUFF.length)
            let buff = this.buffs[id]
            delete this.buffs[id]
            this.structures[y][x] = GROD
            return buff
        }
    }

    getValidSteps(startX, startY, direction, steps) {
        for (let i = 1; i <= steps; i++) {
            if (direction === 'up' && this.structures[startY - i][startX] === WALL){
                return i-1
            } else if (direction === 'down' && this.structures[startY + i][startX] === WALL) {
                return i-1
            } else if (direction === 'left' && this.structures[startY][startX - i] === WALL) {
                return i-1
            } else if (direction === 'right' && this.structures[startY][startX + i] === WALL) {
                return i-1
            }
        }
        return steps
    }

    getWidth() {
        return this.structures[0].length
    }

    getHeight() {
        return this.structures.length
    }

    // Return all attributes that should be allowed to send to the clients
    getAll() {
        let buffs = {}
        for (let property in this.buffs) {
            buffs[property] = this.buffs[property].getAll()
        }

        return {
            structures: this.structures,
            buffs
        }
    }
}

module.exports = Map