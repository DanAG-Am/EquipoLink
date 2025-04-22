/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

//dibujar segun el sprite y la duracion, update y ataque sobre los enemigos y jugador que tienen las distintas armas
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
        this.alive = false; //no dibujar bomba

        // aplicar daño en cierto radio
        if (game.enemies && Array.isArray(game.enemies)) {
            game.enemies.forEach(enemy => {
                const distance = Math.sqrt(
                    Math.pow(enemy.position.x - this.position.x, 2) +
                    Math.pow(enemy.position.y - this.position.y, 2)
                );
                if (distance <= this.explosionRadius) {
                    enemy.takeDamage(this.attack); // el enemigo recibe daño
                }
            });
        }
    }

    draw(ctx) {
        if (!this.alive) return;
        if (this.frameIndex >= 1) {
            const explosionSize = 192;
            const offset = (explosionSize - 32) / 2;
            ctx.drawImage(this.image, this.position.x - offset, this.position.y - offset, explosionSize, explosionSize);
        } else {
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

        // Verificar colisiones con paredes
        const wallBoxes = getWallBoxes();
        for (let wall of wallBoxes) {
            if (boxOverlap(
                { position: this.position, width: this.width, height: this.height },
                wall
            )) {
                this.alive = false;
                break;
            }
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
        this.width = 32;
        this.height = 32;
        this.attack = 15;
        this.velocityArrow = 0.3;
        this.maxDistance = tileSize * 5;
        this.distanceTraveled = 0;

        this.image = new Image();
        this.isVectorDirection = false;
        this.rotationAngle = 0; // solo para proyectiles rotados (mago)

        if (typeof direction === "string") {
            // Proyectil del jugador (dirección fija)
            this.direction = direction;

            if (direction === "up") {
                this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_3.png";
            } else if (direction === "down") {
                this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_3.png";
                this.flipY = true;
            } else if (direction === "right") {
                this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_7.png";
            } else if (direction === "left") {
                this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_7.png";
                this.flipX = true;
            }

            this.velocity = {
                up: new Vec(0, -this.velocityArrow),
                down: new Vec(0, this.velocityArrow),
                left: new Vec(-this.velocityArrow, 0),
                right: new Vec(this.velocityArrow, 0)
            }[direction];

        } else if (direction instanceof Vec) {
            // Proyectil del mago (dirección libre)
            this.isVectorDirection = true;
            const normalized = direction.normalize();
            this.velocity = normalized.scale(this.velocityArrow);

            this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Magic_7.png";

            // Ajusta el ángulo (ya no sumamos Math.PI/2)
            this.rotationAngle = Math.atan2(this.velocity.y, this.velocity.x);
        } else {
            this.alive = false;
            this.velocity = new Vec(0, 0);
        }
    }

    update(deltaTime) {
        const movement = this.velocity.times(deltaTime);
        this.position = this.position.plus(movement);
        this.distanceTraveled += movement.length();

        if (this.distanceTraveled >= this.maxDistance) {
            this.alive = false;
        }

        const wallBoxes = getWallBoxes();
        for (let wall of wallBoxes) {
            if (boxOverlap({ position: this.position, width: this.width, height: this.height }, wall)) {
                this.alive = false;
                break;
            }
        }
    }

    draw(ctx) {
        ctx.save();

        if (this.isVectorDirection) {
            // Rotación libre (mago)
            ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
            ctx.rotate(this.rotationAngle);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        } else {
            // Jugador: simula flip horizontal o vertical
            let scaleX = this.flipX ? -1 : 1;
            let scaleY = this.flipY ? -1 : 1;

            let drawX = this.position.x;
            let drawY = this.position.y;

            ctx.translate(drawX + (this.flipX ? this.width : 0), drawY + (this.flipY ? this.height : 0));
            ctx.scale(scaleX, scaleY);

            ctx.drawImage(this.image, 0, 0, this.width, this.height);
        }

        ctx.restore();
    }
}

class Fireball {
    constructor(position, directionVec) {
        this.alive = true;
        this.position = position;
        this.width = 32;
        this.height = 32;
        this.attack = 20;
        this.velocitySpeed = 0.25;
        this.maxDistance = tileSize * 12;
        this.distanceTraveled = 0;

        this.image = new Image();
        this.image.src = "../../Videojuego/Assets/GameAssets/Weapons/Fire.png";

        const normalized = directionVec.normalize();
        this.velocity = normalized.scale(this.velocitySpeed);

        this.angle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;

        // Efecto de explosión
        this.exploding = false;
        this.explosionFrames = [
            "../../Videojuego/Assets/GameAssets/Weapons/Bomb_2.png",
            "../../Videojuego/Assets/GameAssets/Weapons/Bomb_3.png",
            "../../Videojuego/Assets/GameAssets/Weapons/Bomb_4.png"
        ];
        this.explosionFrameIndex = 0;
        this.explosionFrameTime = 0;
        this.explosionDuration = 300;
    }

    update(deltaTime) {
        if (this.exploding) {
            this.explosionFrameTime += deltaTime;
            if (this.explosionFrameTime > this.explosionDuration / this.explosionFrames.length) {
                this.explosionFrameIndex++;
                this.explosionFrameTime = 0;
                if (this.explosionFrameIndex >= this.explosionFrames.length) {
                    this.alive = false;
                } else {
                    this.image.src = this.explosionFrames[this.explosionFrameIndex];
                }
            }
            return;
        }

        let movement = this.velocity.times(deltaTime);
        this.position = this.position.plus(movement);
        this.distanceTraveled += movement.length();

        if (this.distanceTraveled >= this.maxDistance) {
            this.alive = false;
        }

        // Colisión con paredes
        const wallBoxes = getWallBoxes();
        for (let wall of wallBoxes) {
            if (boxOverlap(
                { position: this.position, width: this.width, height: this.height },
                wall
            )) {
                this.explode();
                return;
            }
        }

        // Colisión con jugador
        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            if (playerStats.life > 0) {
                playerStats.life = Math.max(0, playerStats.life - this.attack);
            }
            this.explode();
            return;
        }
        if (this.distanceTraveled >= this.maxDistance) {
            this.explode();
        }
    }

    explode() {
        this.exploding = true;
        this.explosionFrameIndex = 0;
        this.image.src = this.explosionFrames[0];
        this.velocity = new Vec(0, 0);
    }

    draw(ctx) {
        ctx.save();
    
        ctx.translate(this.position.x, this.position.y);
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(this.angle);
    
        // Inicializa con tamaño base
        let drawWidth = this.width;
        let drawHeight = this.height;
    
        // Si está explotando, agranda el sprite
        if (this.exploding) {
            const scale = 2; // Ajusta este valor si quieres más grande
            drawWidth = this.width * scale;
            drawHeight = this.height * scale;
        }
    
        ctx.drawImage(this.image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
    }
}