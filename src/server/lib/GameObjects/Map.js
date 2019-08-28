const GROD = 'G' // Ground
const WALL = 'W'

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

        // Construct an 2D width x height array
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
        return {
            structures: this.structures
        }
    }
}

module.exports = Map