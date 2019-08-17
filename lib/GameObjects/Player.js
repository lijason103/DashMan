class Player{
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.hp = 100
    }

    setX(x) {
        this.x = x
    }

    setY(y) {
        this.y = y
    }

    setHp(hp) {
        this.hp = hp
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

    getAll() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            hp: this.hp
        }
    }
}

module.exports = Player
