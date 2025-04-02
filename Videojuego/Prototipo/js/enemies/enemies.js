class Boss extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackBoss": ["../../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-1.png","../../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-2.png","../../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-3.png", "../../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-4.png"]
        };
        this.currentDirection = "fly";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 100;
        this.chaseSpeed = 0.2;
        this.life = 150;
        this.attackFire = 20;
        this.attack = 10; 
        this.isDead = false;
        this.attack = this.getRandomAttackDamage(); 
        this.attackInterval = this.getRandomAttackInterval(); 
        this.lastAttackTime = 0;
        this.getHitBox();
    }

    getRandomAttackDamage() {
        const minDamage = 3; 
        const maxDamage = 10; 
        return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    }

   
    getRandomAttackInterval() {
        const minInterval = 500;  
        const maxInterval = 10000; 
        return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    }

    update(deltaTime,playerPosition) {
        if (gamePaused) return;

        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) {
            let directionToPlayer = playerPosition.minus(this.position);  // Vector from bat to player
            directionToPlayer.normalize();  // Normalize the vector to get direction
            this.velocity = directionToPlayer.scale(this.chaseSpeed); 
        } else {
            this.velocity = new Vec(0, 0);
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }

        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        this.position = nextPosition;
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
                playerStats.life = Math.max(0, playerStats.life - this.attack);
                this.lastAttackTime = currentTime; 
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

class Bat extends AnimatedObject {
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "fly": ["../../Videojuego/Assets/GameAssets/Enemies/enemy_Bat/Bat-1.png", "../../Videojuego/Assets/GameAssets/Enemies/enemy_Bat/Bat-2.png"],
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
        this.attack = 5;
        this.lastAttackTime = 0;  
        this.attackInterval = 500; 
        getHitbox()

    }

    // Update method now takes playerPosition as a parameter
    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        const distanceToPlayer = this.position.distance(playerPosition);
    
        // If within chase range, start chasing the player
        if (distanceToPlayer < this.chaseRange) {
            // Calculate the direction from the bat to the player
            let directionToPlayer = playerPosition.minus(this.position);  // Vector from bat to player
            directionToPlayer.normalize();  // Normalize the vector to get direction
            this.velocity = directionToPlayer.scale(this.chaseSpeed); 
        } else {
            // If outside chase range, stop moving
            this.velocity = new Vec(0, 0);
        }
    
        // Boundary checks to prevent the bat from going off-screen
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        // Update the bat's position based on the velocity
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        this.position = nextPosition;

        // Update animation
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
                playerStats.life = Math.max(0, playerStats.life - this.attack);
                this.lastAttackTime = currentTime; 
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
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackKnight": ["../../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-1.png","../../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-2.png","../../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-3.png"],
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
        this.attack = 15;
        this.lastAttackTime = 0;
        this.attackInterval = 1000;
        getHitbox()
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        const distanceToPlayer = this.position.distance(playerPosition);
    
        if (distanceToPlayer < this.chaseRange) {
            let directionToPlayer = playerPosition.minus(this.position);  // Vector from bat to player
            directionToPlayer.normalize();  // Normalize the vector to get direction
            this.velocity = directionToPlayer.scale(this.chaseSpeed); 
        } else {
            this.velocity = new Vec(0, 0);
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        this.position = nextPosition;

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

            if (currentTime - this.lastAttackTime > this.attackInterval && playerStats.life >0) {
                playerStats.life = Math.max(0, playerStats.life - this.attack);
                this.lastAttackTime = currentTime; 
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

class Mage extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackMage": ["../../Videojuego/Assets/GameAssets/Enemies/enemy_Mage/Mage-1.png","../../Videojuego/Assets/GameAssets/Enemies/enemy_Mage/Mage-2.png"],
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
        this.magicAttack = 10;
        this.attack = 5;
        this.lastAttackTime = 0;
        this.attackInterval = 3000;
        getHitbox()
    }

    update(deltaTime,playerPosition) {
        if (gamePaused) return;

        const distanceToPlayer = this.position.distance(playerPosition);
    
        if (distanceToPlayer < this.chaseRange) {
            let directionToPlayer = playerPosition.minus(this.position);  // Vector from bat to player
            directionToPlayer.normalize();  // Normalize the vector to get direction
            this.velocity = directionToPlayer.scale(this.chaseSpeed); 
        } else {
            this.velocity = new Vec(0, 0);
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        this.position = nextPosition;
    
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
                playerStats.life = Math.max(0, playerStats.life - this.attack);
                this.lastAttackTime = currentTime; 
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

class Skull extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackSkull": ["../../Videojuego/Assets/GameAssets/Enemies/enemy_Skull/Skull.png", "../../Videojuego/Assets/GameAssets/Enemies/enemy_Skull/Skull2.png"]
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
        this.attack = 15;
        this.lastAttackTime = 0;
        this.attackInterval = 1000;
        getHitbox()
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        const distanceToPlayer = this.position.distance(playerPosition);
    
        if (distanceToPlayer < this.chaseRange) {
            let directionToPlayer = playerPosition.minus(this.position);  // Vector from bat to player
            directionToPlayer.normalize();  // Normalize the vector to get direction
            this.velocity = directionToPlayer.scale(this.chaseSpeed); 
        } else {
            this.velocity = new Vec(0, 0);
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        this.position = nextPosition;

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
                playerStats.life = Math.max(0, playerStats.life - this.attack);
                this.lastAttackTime = currentTime; 
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
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackSlime": ["../../Videojuego/Assets/GameAssets/Enemies/enemy_Slime/Slime-1.png","../../Videojuego/Assets/GameAssets/Enemies/enemy_Slime/Slime-2.png"]
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
        this.attack = 5;
        this.lastAttackTime = 0;
        this.attackInterval = 5000;
        getHitbox()
    }

    update(deltaTime, playerPosition) {
        if (gamePaused) return;

        const distanceToPlayer = this.position.distance(playerPosition);

        if (distanceToPlayer < this.chaseRange) {
            let directionToPlayer = playerPosition.minus(this.position);  // Vector from bat to player
            directionToPlayer.normalize();  // Normalize the vector to get direction
            this.velocity = directionToPlayer.scale(this.chaseSpeed); 
        } else {
            this.velocity = new Vec(0, 0);
        }
    
        if (this.position.x + this.width > canvasWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }

        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        this.position = nextPosition;
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
                playerStats.life = Math.max(0, playerStats.life - this.attack);
                this.lastAttackTime = currentTime; 
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}