/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
/*clases derivadas de los enemigos, se repite la misma estructura de boss en el resto*/

let playerHurtAudio = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Character/link_hurt.wav");
playerHurtAudio.volume = 1;
playerHurtAudio.loop = false;

function playerHurtSFX() {
    if (!playerHurtAudio.paused) return; // Don't overlap if it's already playing
    playerHurtAudio.currentTime = 0;
    playerHurtAudio.play();
}

function dragonSFX(){
    const sfx = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Enemy/boss_ambientsound.wav");
    sfx.loop = true;
    sfx.volume = 0.5;
    sfx.play();
}

class Boss extends AnimatedObject{
    // Constructor: Inicializa al jefe con su posición, tamaño y otras propiedades como velocidad, sprites y estadísticas.
    constructor(position, width, height) {
        // Llama al constructor de la clase base AnimatedObject con los parámetros adecuados.
        super("#000000", width, height, position.x, position.y, "bat");

        // Inicializa la posición y la velocidad del jefe como objetos Vec (vectores).
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);

        // Define las rutas a los sprites de la animación de ataque.
        this.sprites = {
            "attackBoss": ["/Videojuego/Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-1.png", 
                           "/Videojuego/Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-2.png", 
                           "/Videojuego/Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-3.png", 
                           "/Videojuego/Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-4.png"]
        };

        // Define el estado actual del jefe y la animación que está usando.
        this.currentDirection = "attackBoss";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];

        // Controla la velocidad de la animación y el tiempo entre cambios de fotogramas.
        this.animationSpeed = 150;
        this.lastFrameChange = 250;

        // Establece el rango de persecución, la velocidad de persecución y las estadísticas del jefe.
        this.chaseRange = 1000;
        this.chaseSpeed = 0.025;
        this.life = 150;
        this.maxLife = 150;
        this.attackFire = 20;
        this.attack = 10; 

        // Inicializa otras propiedades como si está muerto, el intervalo de ataque y tiempos.
        this.isDead = false;
        this.attack = this.getRandomAttackDamage(); 
        this.attackInterval = this.getRandomAttackInterval(); 
        this.lastAttackTime = 0;
        this.lastDamageTime = 0;
        this.damageCooldown = 500;
        this.fireballs = [];
        this.fireCooldown = 2500;
        this.lastFireTime = 0;
        this.facingLeft = true;

        // Calcula el área de colisión (hitbox) del jefe.
        this.getHitbox();
    }

    // Método que obtiene un daño de ataque aleatorio dentro de un rango.
    getRandomAttackDamage() {
        const minDamage = 3; 
        const maxDamage = 10; 
        return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    }

    // Método que genera un intervalo de ataque aleatorio dentro de un rango.
    getRandomAttackInterval() {
        const minInterval = 500;  
        const maxInterval = 10000; 
        return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    }

    // Método de actualización que controla el movimiento, persecución y ataques del jefe.
    update(deltaTime, playerPosition) {
        if (gamePaused) return; // Detiene la ejecución si el juego está pausado.

        // Calcula la distancia entre el jefe y el jugador.
        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) { // Si el jugador está dentro del rango de persecución, el jefe comienza a moverse hacia él
            let directionToPlayer = playerPosition.minus(this.position).normalize();   // Vector hacia el jugador
            this.velocity = directionToPlayer.scale(this.chaseSpeed); // Establece la velocidad del jefe
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si el jugador está fuera de rango.
        }
    
        // Verifica si el jefe ha chocado con los bordes del lienzo y cambia la dirección si es necesario.
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }

        // Se voltea según donde está ubicado el jugador
        if (playerPosition.x > this.position.x) {
            this.facingLeft = false; // el jugador está a la derecha
        } else {
            this.facingLeft = true;  // el jugador está a la izquierda
        }

        // Calcula la nueva posición del jefe basada en su velocidad y el tiempo transcurrido.
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));

        // Crea un objeto que representa la futura colisión del jefe.
        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        
        // Detecta colisiones con las paredes del juego.
        const wallBoxes = getWallBoxes();
        let collidesWithWall = false;
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
        
        // Si no hay colisión, actualiza la posición del jefe.
        if (!collidesWithWall) {
            this.position = nextPosition;
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si choca con una pared.
        }

        // Controla la animación del jefe, cambiando el sprite cada cierto tiempo.
        this.lastFrameChange += deltaTime;
        if (this.lastFrameChange > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image.src = this.sprites[this.currentDirection][this.frameIndex];
            this.lastFrameChange = 0;
        }

        // Detecta si el jefe colide con el jugador y le causa daño si es necesario.
        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            const currentTime = Date.now(); 
            // Si ha pasado suficiente tiempo desde el último ataque, inflige daño al jugador.
            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life > 0) {
                this.lastAttackTime = currentTime;

                // Bloquea el daño si el escudo está activo y no ha sido usado aún
                if (game.player.shieldActive && currentTime - game.player.lastShieldBlockTime > game.player.shieldCooldown) {
                    game.player.lastShieldBlockTime = currentTime; // bloquea el daño e inicia cooldown
                    shieldSFX();
                } else {
                    // recibe daño normalmente
                    playerStats.life = Math.max(0, playerStats.life - this.attack);
                    playerHurtSFX();
                }
            }
        }

        // Actualizar los fireballs
        if (Date.now() - this.lastFireTime > this.fireCooldown) {
            this.castFire(playerPosition);
            this.lastFireTime = Date.now();
        }
        this.fireballs.forEach(fire => fire.update(deltaTime));
        this.fireballs = this.fireballs.filter(fire => fire.alive);
    }

    castFire(playerPosition) {
        const fireWidth = 32;
        const fireHeight = 32;
        
        // Posición base del centro del jefe
        let baseX = this.position.x + (this.width / 2) - (fireWidth / 2);
        let baseY = this.position.y + (this.height / 2) - (fireHeight / 2);
    
        // Ajustar salida según la dirección (boca del dragón)
        if (this.facingLeft) {
            baseX = this.position.x; // boca lado izquierdo
            baseY = this.position.y + this.height / 2 - fireHeight / 2 - 5;
        } else {
            baseX = this.position.x + this.width - fireWidth; // boca lado derecho
            baseY = this.position.y + this.height / 2 - fireHeight / 2 - 5;
        }
    
        const fireStart = new Vec(baseX, baseY);
    
        const directionToPlayer = playerPosition.minus(this.position);
        const normalizedDirection = directionToPlayer.normalize();
    
        this.fireballs.push(new Fireball(fireStart, normalizedDirection));
    }

    // Método que dibuja al jefe en el lienzo usando su imagen.
    draw(ctx) {
        ctx.save();

        let drawX = this.position.x;
        let drawY = this.position.y;
    
        if (!this.facingLeft) {
            ctx.translate(drawX + this.width, drawY); // mueve el contexto
            ctx.scale(-1, 1); // voltea horizontalmente
            drawX = 0;
            drawY = 0;
        }
    
        ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
        ctx.restore();

        this.fireballs.forEach(fb => fb.draw(ctx));
    }
}

class Bat extends AnimatedObject {
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.name = "bat";
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "fly": ["/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Bat/Bat-1.png", "/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Bat/Bat-2.png"],
        };
        this.currentDirection = "fly";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 100;  
        this.chaseSpeed = 0.1;  
        this.life = 20;
        this.maxLife = 20;
        this.attack = 5;
        this.lastAttackTime = 0;  
        this.attackInterval = 500;
        this.lastDamageTime = 0;
        this.damageCooldown = 500;
        getHitbox()
    }

    // Update method now takes playerPosition as a parameter
    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        // Calcula la distancia entre el bat y el jugador.
        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) { // Si el jugador está dentro del rango de persecución, el bat comienza a moverse hacia él
            let directionToPlayer = playerPosition.minus(this.position).normalize();   // Vector hacia el jugador
            this.velocity = directionToPlayer.scale(this.chaseSpeed); // Establece la velocidad del bat
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si el jugador está fuera de rango.
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }

        let nextPosition = this.position.plus(this.velocity.times(deltaTime));

        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        
        // Detecta colisión con las paredes
        const wallBoxes = getWallBoxes();
        let collidesWithWall = false;
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
        
        if (!collidesWithWall) {
            this.position = nextPosition;
        } else {
            this.velocity = new Vec(0, 0); // Detener movimiento si choca
        }
        this.lastFrameChange += deltaTime;
        if (this.lastFrameChange > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image.src = this.sprites[this.currentDirection][this.frameIndex];
            this.lastFrameChange = 0;
        }

        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            const currentTime = Date.now(); 

            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life > 0) {
                this.lastAttackTime = currentTime;

                // Bloquea el daño si el escudo está activo y no ha sido usado aún
                if (game.player.shieldActive && currentTime - game.player.lastShieldBlockTime > game.player.shieldCooldown) {
                    game.player.lastShieldBlockTime = currentTime; // bloquea el daño e inicia cooldown
                    shieldSFX();
                } else {
                    // recibe daño normalmente
                    playerStats.life = Math.max(0, playerStats.life - this.attack);
                    playerHurtSFX();
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

class Knight extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.name = "knight";
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackKnight": ["/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-1.png","/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-2.png","../../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-3.png"],
        };
        this.currentDirection = "attackKnight";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 300;
        this.chaseSpeed = 0.1;
        this.life = 70;
        this.maxLife = 70;
        this.attack = 15;
        this.lastAttackTime = 0;
        this.attackInterval = 1000;
        this.lastDamageTime = 0;
        this.damageCooldown = 500;
        getHitbox()
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        // Calcula la distancia entre el knight y el jugador.
        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) { // Si el jugador está dentro del rango de persecución, el knight comienza a moverse hacia él
            let directionToPlayer = playerPosition.minus(this.position).normalize();   // Vector hacia el jugador
            this.velocity = directionToPlayer.scale(this.chaseSpeed); // Establece la velocidad del knight
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si el jugador está fuera de rango.
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));

        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        
        // Detecta colisión con las paredes
        const wallBoxes = getWallBoxes();
        let collidesWithWall = false;
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
        
        if (!collidesWithWall) {
            this.position = nextPosition;
        } else {
            this.velocity = new Vec(0, 0); // Detener movimiento si choca
        }

        this.lastFrameChange += deltaTime;
        if (this.lastFrameChange > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image.src = this.sprites[this.currentDirection][this.frameIndex];
            this.lastFrameChange = 0;
        }

        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            const currentTime = Date.now(); 

            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life > 0) {
                this.lastAttackTime = currentTime;

                // Bloquea el daño si el escudo está activo y no ha sido usado aún
                if (game.player.shieldActive && currentTime - game.player.lastShieldBlockTime > game.player.shieldCooldown) {
                    game.player.lastShieldBlockTime = currentTime; // bloquea el daño e inicia cooldown
                    shieldSFX();
                } else {
                    // recibe daño normalmente
                    playerStats.life = Math.max(0, playerStats.life - this.attack);
                    playerHurtSFX();
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

class Mage extends AnimatedObject {
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.name = "mage";
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackMage": [
                "/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Mage/Mage-1.png",
                "/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Mage/Mage-2.png"
            ]
        };
        this.currentDirection = "attackMage";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 1000;
        this.chaseSpeed = 0.05;
        this.life = 40;
        this.maxLife = 40;
        this.magicAttack = 10;
        this.attack = 5;
        this.lastAttackTime = 0;
        this.attackInterval = 3000;
        this.lastDamageTime = 0;
        this.damageCooldown = 500;
        this.magicCooldown = 2000;
        this.lastMagicCastTime = 0;
        this.magics = [];
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        // Calcula la distancia entre el mago y el jugador.
        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) { // Si el jugador está dentro del rango de persecución, el mago comienza a moverse hacia él
            let directionToPlayer = playerPosition.minus(this.position).normalize();   // Vector hacia el jugador
            this.velocity = directionToPlayer.scale(this.chaseSpeed); // Establece la velocidad del mago
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si el jugador está fuera de rango.
        }

        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }

        let nextPosition = this.position.plus(this.velocity.times(deltaTime));

        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };

        const wallBoxes = getWallBoxes();
        let collidesWithWall = false;
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }

        if (!collidesWithWall) {
            this.position = nextPosition;
        } else {
            this.velocity = new Vec(0, 0);
        }

        if (
            distanceToPlayer < this.chaseRange &&
            distanceToPlayer > 100 &&
            Date.now() - this.lastMagicCastTime > this.magicCooldown
        ) {
            this.castMagic(playerPosition);
            this.lastMagicCastTime = Date.now();
        }

        this.lastFrameChange += deltaTime;
        if (this.lastFrameChange > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image.src = this.sprites[this.currentDirection][this.frameIndex];
            this.lastFrameChange = 0;
        }

        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            const currentTime = Date.now(); 

            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life > 0) {
                this.lastAttackTime = currentTime;

                // Bloquea el daño si el escudo está activo y no ha sido usado aún
                if (game.player.shieldActive && currentTime - game.player.lastShieldBlockTime > game.player.shieldCooldown) {
                    game.player.lastShieldBlockTime = currentTime; // bloquea el daño e inicia cooldown
                    shieldSFX();
                } else {
                    // recibe daño normalmente
                    playerStats.life = Math.max(0, playerStats.life - this.attack);
                    playerHurtSFX();
                }
            }
        }

        for (let magic of this.magics) {
            magic.update(deltaTime);
        }

        this.checkMagicCollisionWithPlayer();
    }

    castMagic(playerPosition) {
        const magicWidth = 32;
        const magicHeight = 32;
        const centerX = this.position.x + (this.width / 2) - (magicWidth / 2);
        const centerY = this.position.y + (this.height / 2) - (magicHeight / 2);
        const magicPosition = new Vec(centerX, centerY);
    
        const directionToPlayer = playerPosition.minus(this.position);
        const normalizedDirection = directionToPlayer.normalize();
    
        this.magics.push(new Magic(magicPosition, normalizedDirection));
    }

    checkMagicCollisionWithPlayer() {
        for (let magic of this.magics) {
            if (boxOverlap(
                { position: game.player.position, width: game.player.width, height: game.player.height },
                { position: magic.position, width: magic.width, height: magic.height }
            )) {
                if (playerStats.life > 0) {
                    playerStats.life = Math.max(0, playerStats.life - magic.attack);
                    magic.alive = false;
                }
            }
        }

        this.magics = this.magics.filter(magic => magic.alive);
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();

        for (let magic of this.magics) {
            magic.draw(ctx);
        }
    }
}

class Skull extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.name = "skull";
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackSkull": ["/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Skull/Skull.png", "/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Skull/Skull2.png"]
        };
        this.currentDirection = "attackSkull";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 80;
        this.chaseSpeed = 0.1;
        this.life = 30;
        this.maxLife = 30;
        this.attack = 15;
        this.lastAttackTime = 0;
        this.attackInterval = 1000;
        this.lastDamageTime = 0;
        this.damageCooldown = 500;
        getHitbox()
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        // Calcula la distancia entre el skull y el jugador.
        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) { // Si el jugador está dentro del rango de persecución, el skull comienza a moverse hacia él
            let directionToPlayer = playerPosition.minus(this.position).normalize();   // Vector hacia el jugador
            this.velocity = directionToPlayer.scale(this.chaseSpeed); // Establece la velocidad del skull
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si el jugador está fuera de rango.
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));

        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        
        // Detecta colisión con las paredes
        const wallBoxes = getWallBoxes();
        let collidesWithWall = false;
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
        
        if (!collidesWithWall) {
            this.position = nextPosition;
        } else {
            this.velocity = new Vec(0, 0); // Detener movimiento si choca
        }

        this.lastFrameChange += deltaTime;
        if (this.lastFrameChange > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image.src = this.sprites[this.currentDirection][this.frameIndex];
            this.lastFrameChange = 0;
        }

        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            const currentTime = Date.now(); 

            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life > 0) {
                this.lastAttackTime = currentTime;

                // Bloquea el daño si el escudo está activo y no ha sido usado aún
                if (game.player.shieldActive && currentTime - game.player.lastShieldBlockTime > game.player.shieldCooldown) {
                    game.player.lastShieldBlockTime = currentTime; // bloquea el daño e inicia cooldown
                    shieldSFX();
                } else {
                    // recibe daño normalmente
                    playerStats.life = Math.max(0, playerStats.life - this.attack);
                    playerHurtSFX();
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

class Slime extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.name = "slime";
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackSlime": ["/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Slime/Slime-1.png","/Videojuego/Videojuego/Assets/GameAssets/Enemies/enemy_Slime/Slime-2.png"]
        };
        this.currentDirection = "attackSlime";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 100;
        this.chaseSpeed = 0.05;
        this.life = 20;
        this.maxLife = 20;
        this.attack = 5;
        this.lastAttackTime = 0;
        this.attackInterval = 5000;
        this.lastDamageTime = 0;
        this.damageCooldown = 500;
        getHitbox()
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        // Calcula la distancia entre el slime y el jugador.
        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) { // Si el jugador está dentro del rango de persecución, el slime comienza a moverse hacia él
            let directionToPlayer = playerPosition.minus(this.position).normalize();   // Vector hacia el jugador
            this.velocity = directionToPlayer.scale(this.chaseSpeed); // Establece la velocidad del slime
        } else {
            this.velocity = new Vec(0, 0); // Detiene el movimiento si el jugador está fuera de rango.
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }

        let nextPosition = this.position.plus(this.velocity.times(deltaTime));

        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        
        // Detecta colisión con las paredes
        const wallBoxes = getWallBoxes();
        let collidesWithWall = false;
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
        
        if (!collidesWithWall) {
            this.position = nextPosition;
        } else {
            this.velocity = new Vec(0, 0); // Detener movimiento si choca
        }
        this.lastFrameChange += deltaTime;
        if (this.lastFrameChange > this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image.src = this.sprites[this.currentDirection][this.frameIndex];
            this.lastFrameChange = 0;
        }

        if (boxOverlap(
            { position: game.player.position, width: game.player.width, height: game.player.height },
            { position: this.position, width: this.width, height: this.height }
        )) {
            const currentTime = Date.now();
            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life > 0) {
                this.lastAttackTime = currentTime;

                // Bloquea el daño si el escudo está activo y no ha sido usado aún
                if (game.player.shieldActive && currentTime - game.player.lastShieldBlockTime > game.player.shieldCooldown) {
                    game.player.lastShieldBlockTime = currentTime; // bloquea el daño e inicia cooldown
                    shieldSFX();
                } else {
                    // recibe daño normalmente
                    playerStats.life = Math.max(0, playerStats.life - this.attack);
                    playerHurtSFX();
                }
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}