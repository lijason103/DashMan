const travel_speed = 25

class Player{
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.hp = 100
        this.max_energy = 20
        this.energy = this.max_energy
        this.chargeRate = 5 // block per second
        this.x_dest = this.x // final destination that it's going to
        this.y_dest = this.y 
        this.energyRate = 1 // amount of energy regenerate per second
    }

    regenerateEnergy(elapsedMS) {
        if (this.energy == this.max_energy) return

        let newEnergy = this.energy + (elapsedMS * this.energyRate)
        this.energy = newEnergy > this.max_energy ? this.energy = this.max_energy : newEnergy
    }

    move(elapsedMS, otherPlayers) {
        if (this.x_dest > this.x) {
            this.x += elapsedMS * travel_speed
            if (this.x_dest < this.x) this.x = this.x_dest
        } else if (this.x_dest < this.x) {
            this.x -= elapsedMS * travel_speed
            if (this.x_dest > this.x) this.x = this.x_dest
        } else if (this.y_dest > this.y) {
            this.y += elapsedMS * travel_speed
            if (this.y_dest < this.y) this.y = this.y_dest
        } else if (this.y_dest < this.y) {
            this.y -= elapsedMS * travel_speed
            if (this.y_dest > this.y) this.y = this.y_dest
        }
        this.checkCollision(otherPlayers)
    }

    checkCollision(otherPlayers) {
        for (let property in otherPlayers) {
            let otherPlayer = otherPlayers[property]
            if (Math.abs(this.x - otherPlayer.x) < 1 && Math.abs(this.y - otherPlayer.y) < 1) {
                console.log('COLLISION!')
            }
        }
    }

    moveDest(direction, steps) {
        // Don't allow it to update the dest when it is still moving
        if (this.y_dest !== this.y) return
        if (this.x_dest !== this.x) return

        // Check if there is enough energy to move
        if (steps > this.energy) {
            steps = Math.floor(this.energy)
        }

        this.energy -= steps
        if (direction === 'up') {
            this.y_dest -= steps
        } else if (direction === 'down') {
            this.y_dest += steps
        } else if (direction === 'left') {
            this.x_dest -= steps        
        } else if (direction === 'right') {
            this.x_dest += steps            
        }
    }

    setHp(amount) {
        this.hp = amount
    }

    getAll() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            hp: this.hp,
            chargeRate: this.chargeRate,
            y_dest: this.y_dest,
            x_dest: this.x_dest,
            energyRate: this.energyRate,
            energy: Math.floor(this.energy),
            max_energy: this.max_energy,
        }
    }
}

module.exports = Player
