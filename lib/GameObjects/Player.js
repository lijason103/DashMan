class Player{
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.hp = 100
        this.chargeRate = 5 // block per second
    }

    move(direction, steps) {
        switch(direction) {
            case 'up': this.y -= steps; break
            case 'down': this.y += steps; break
            case 'left': this.x -= steps; break
            case 'right': this.x += steps; break
        }
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
            hp: this.hp,
            chargeRate: this.chargeRate
        }
    }
}

module.exports = Player
