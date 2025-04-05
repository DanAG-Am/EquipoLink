class Bomb {
    constructor(position) {
        this.position = position;
        this.exploded = false;
        this.frameIndex = 0;
        this.frames = [
            "../../Videojuego/Assets/GameAssets/Pickup/pickup_Bomb.png",
            "../../Videojuego/Assets/GameAssets/Weapons/Bomb_2.png",
            "../../Videojuego/Assets/GameAssets/Weapons/Bomb_3.png",
            "../../Videojuego/Assets/GameAssets/Weapons/Bomb_4.png"
        ];
        this.image = new Image();
        this.image.src = this.frames[this.frameIndex];
        this.alive = true;
        this.attack = 20;
        this.explosionRadius = 50;
        // Programar cambios de frame
        setTimeout(() => this.setFrame(1), 2000);
        setTimeout(() => this.setFrame(2), 2200);
        setTimeout(() => this.setFrame(3), 2400);
        setTimeout(() => this.explode(), 2600);
    }

    setFrame(index) {
        this.frameIndex = index;
        this.image.src = this.frames[index];
    }

    explode() {
        this.alive = false; // stop drawing the bomb

        // Now apply damage to enemies within the explosion radius
        game.enemies.forEach(enemy => {
            const distance = Math.sqrt(
                Math.pow(enemy.position.x - this.position.x, 2) + Math.pow(enemy.position.y - this.position.y, 2)
            );
            if (distance <= this.explosionRadius) {
                enemy.takeDamage(this.attack); // Assuming enemies have a takeDamage method
            }
        });
    }

    draw(ctx) {
        if (this.alive) {
            ctx.drawImage(this.image, this.position.x, this.position.y, 32, 32);
        }
    }
}
class Arrow {
    constructor(position, direction) {
        this.alive = true;
        this.position = position;
        this.direction = direction;
        this.velocityArrow = 0.3;
        this.distanceTraveled = 0;
        this.maxDistance = tileSize * 10;
        this.width = 32;
        this.height = 32;
        this.attack = 5;

        this.image = new Image();
        if (direction === "up" || direction === "down") {
            this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Fire_arrow_1.png";
        } else {
            this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Fire_arrow_2.png";
        }

        this.velocity = {
            up: new Vec(0, -this.velocityArrow),
            down: new Vec(0, this.velocityArrow),
            left: new Vec(-this.velocityArrow, 0),
            right: new Vec(this.velocityArrow, 0)
        }[direction];
    }

    update(deltaTime) {
        let movement = this.velocity.times(deltaTime);
        this.position = this.position.plus(movement);
        this.distanceTraveled += movement.length();

        if (this.distanceTraveled >= this.maxDistance) {
            this.alive = false;
        }
    }

    draw(ctx) {
        ctx.save();
        let drawX = this.position.x;
        let drawY = this.position.y;
        if (this.direction === "left") {
            ctx.scale(-1, 1);
            drawX = -drawX - this.width;
        }
        if (this.direction === "down") {
            ctx.scale(1, -1);
            drawY = -drawY - this.height;
        }
        ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
        ctx.restore();
    }
}


class Magic {
    constructor(position, direction) {
        this.alive = true;
        this.position = position;
        this.direction = direction;
        this.velocityArrow = 0.3;
        this.distanceTraveled = 0;
        this.maxDistance = tileSize * 5;
        this.width = 32;
        this.height = 32;
        this.attack = 15;

        this.image = new Image();
        if (direction === "up" || direction === "down") {
            this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_3.png";
        } else {
            this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_7.png";
        }

        this.velocity = {
            up: new Vec(0, -this.velocityArrow),
            down: new Vec(0, this.velocityArrow),
            left: new Vec(-this.velocityArrow, 0),
            right: new Vec(this.velocityArrow, 0)
        }[direction];
    }

    update(deltaTime) {
        let movement = this.velocity.times(deltaTime);
        this.position = this.position.plus(movement);
        this.distanceTraveled += movement.length();

        if (this.distanceTraveled >= this.maxDistance) {
            this.alive = false;
        }
    }

    draw(ctx) {
        ctx.save();
        let drawX = this.position.x;
        let drawY = this.position.y;
        if (this.direction === "left") {
            ctx.scale(-1, 1);
            drawX = -drawX - this.width;
        }
        if (this.direction === "down") {
            ctx.scale(1, -1);
            drawY = -drawY - this.height;
        }
        ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
        ctx.restore();
    }
}