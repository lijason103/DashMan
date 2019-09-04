const travel_speed = 25 // 25

class Player{
    constructor(id, name, x, y) {
        this.id = id
        this.name = name
        this.x = x
        this.y = y
        this.max_hp = 4
        this.hp = this.max_hp
        this.max_energy = 20
        this.energy = this.max_energy
        this.chargeRate = 7 // block per second
        this.x_dest = this.x // final destination that it's going to
        this.y_dest = this.y 
        this.energyRate = 1.5 // amount of energy regenerate per second

        this.damagedPlayers = {} // A list of players that's been damaged by current player during the current movement
        this.distanceTraveled = 0 // The distance between original location and current location
        this.isCharging = false

        this.activeBuff = null
        this.dmgMultiplier = 1
    }

    updateBuff(currentTime) {
        if (this.activeBuff && this.activeBuff.isExpired(currentTime)) {
            this.activeBuff.deactivate(this)
            this.activeBuff = null
        }
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
            if (otherPlayer.activeBuff && otherPlayer.activeBuff.getType() === 'INVINCIBILITY_BUFF') return 

            if (Math.abs(this.x - otherPlayer.x) < 1 && Math.abs(this.y - otherPlayer.y) < 1) {
                if (this.distanceTraveled > otherPlayer.distanceTraveled) {
                    // Only the one who traveled the furthest can deal dmg
                    let dmg = (otherPlayer.max_hp/3 + 0.1) * this.dmgMultiplier
                    console.log(this.id, 'damaged', otherPlayer.id, 'by', dmg.toFixed(2))
                    otherPlayer.hp -= dmg
                    // players[property].hp -= this.distanceTraveled
                    this.damagedPlayers[otherPlayer.id] = true
                }
            }
        }
    }

    moveDest(map, direction, steps) {
        // Don't allow it to update the dest when it is still moving
        if (this.y_dest !== this.y) return
        if (this.x_dest !== this.x) return
        if (this.hp <= 0) return

        // Detect walls
        steps = map.getValidSteps(this.x, this.y, direction, steps)

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
            name: this.name,
            x: this.x,
            y: this.y,
            max_hp: this.max_hp,
            hp: this.hp,
            chargeRate: this.chargeRate,
            y_dest: this.y_dest,
            x_dest: this.x_dest,
            energyRate: this.energyRate,
            energy: Math.floor(this.energy),
            max_energy: this.max_energy,
            distanceTraveled: this.distanceTraveled,
            isCharging: this.isCharging,
            activeBuff: this.activeBuff ? this.activeBuff.getDurationAll() : null
        }
    }
}

module.exports = Player
