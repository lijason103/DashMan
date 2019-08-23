const travel_speed = 25

class Player{
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.hp = 10
        this.max_energy = 20
        this.energy = this.max_energy
        this.chargeRate = 5 // block per second
        this.x_dest = this.x // final destination that it's going to
        this.y_dest = this.y 
        this.energyRate = 1 // amount of energy regenerate per second

        this.damagedPlayers = {} // A list of players that's been damaged by current player during the current movement
        this.distanceTraveled = 0 // The distance between original location and current location
    }

    regenerateEnergy(elapsedMS) {
        if (this.energy == this.max_energy) return

        let newEnergy = this.energy + (elapsedMS * this.energyRate)
        this.energy = newEnergy > this.max_energy ? this.energy = this.max_energy : newEnergy
    }

    move(elapsedMS) {
        // Update the location
        let distance = elapsedMS * travel_speed
        if (this.x_dest > this.x) {
            this.x += distance
            this.distanceTraveled += distance
            // Arrived to the dest location
            if (this.x_dest < this.x) {
                this.x = this.x_dest
                this.damagedPlayers = {}
                this.distanceTraveled = 0
            }
        } else if (this.x_dest < this.x) {
            this.x -= distance
            this.distanceTraveled += distance
            // Arrived to the dest location
            if (this.x_dest > this.x) {
                this.x = this.x_dest
                this.damagedPlayers = {}
                this.distanceTraveled = 0
            }
        } else if (this.y_dest > this.y) {
            this.y += distance
            this.distanceTraveled += distance
            // Arrived to the dest location
            if (this.y_dest < this.y) {
                this.y = this.y_dest
                this.damagedPlayers = {}
                this.distanceTraveled = 0
            }
        } else if (this.y_dest < this.y) {
            this.y -= distance
            this.distanceTraveled += distance
            // Arrived to the dest location
            if (this.y_dest > this.y) {
                this.y = this.y_dest
                this.damagedPlayers = {}
                this.distanceTraveled = 0
            }
        } else {
            this.damagedPlayers = {}
            this.distanceTraveled = 0
        }
    }

    // Check collision and damage other players
    dealCollisionDamage(players) {
        // No need to check if the player is stationary
        if (this.x === this.x_dest && this.y === this.y_dest) return
        // No need to check if the player has no health
        if (this.hp <= 0) return 

        for (let property in players) {
            let otherPlayer = players[property]
            // Ignore this player and ignore already damaged the player previously
            if (otherPlayer.id === this.id || this.damagedPlayers.hasOwnProperty(property) || otherPlayer.hp <= 0) continue

            if (Math.abs(this.x - otherPlayer.x) < 1 && Math.abs(this.y - otherPlayer.y) < 1) {
                if (this.distanceTraveled > otherPlayer.distanceTraveled) {
                    // Only the one who traveled the 
                    console.log(this.id, 'damaged', otherPlayer.id, 'by', this.distanceTraveled.toFixed(2))
                    otherPlayer.hp -= this.distanceTraveled
                    // players[property].hp -= this.distanceTraveled
                    this.damagedPlayers[otherPlayer.id] = true
                }
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
            distanceTraveled: this.distanceTraveled,
        }
    }
}

module.exports = Player
