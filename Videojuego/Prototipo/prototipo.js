/*
 * Simple animation on the HTML canvas
 *
 * TeamLink
 * 2025-02-19
 */

"use strict";

const canvasWidth = 800;
const canvasHeight = 608;
let ctx, uiCtx, game;
let oldTime;
let playerSpeed = 0.15;
let showUI = false;
let gamePaused = false;
let interactingNPC = false;
let chestIsOpen = false; 
let interactingMerchant = false;
let currentItemType = "";
//tiles
const tileSize = 32;
const processedFloors = {};
const floorTile1 = new Image();
floorTile1.src = "../Videojuego/Assets/GameAssets/Map/Floor/floor_Tile.png";
const floorTile2 = new Image();
floorTile2.src = "../Videojuego/Assets/GameAssets/Map/Floor/floor_Tile2.png";
const floorDoor = new Image();
floorDoor.src = "../Videojuego/Assets/GameAssets/Map/Floor/floor_Void.png";
const wallTile = new Image();
wallTile.src = "../Videojuego/Assets/GameAssets/Map/Floor/floor_Block.png";
//ui Images
const rupeeImg = new Image();
rupeeImg.src = "../Videojuego/Assets/GameAssets/Pickup/pickup_Rupee1.png";
const heartImg = new Image();
heartImg.src = "../Videojuego/Assets/GameAssets/Pickup/pickup_HealthUpgrade.png";
const potionImg = new Image();
potionImg.src = "../Videojuego/Assets/GameAssets/Pickup/pickup_PotionHealth.png";
const arrowImg = new Image();
arrowImg.src = "../Videojuego/Assets/GameAssets/Weapons/Arrow_2.png";
const bombIcon = new Image();
bombIcon.src = "../Videojuego/Assets/GameAssets/Weapons/Bomb_1.png";

let playerStats = {
    level: 0,
    life: 100,
    mana: 100,
    rupees: 0,
    potions: 0,
    arrows: 0,
    bombs: 0
};

function getWallBoxes() {
    const layoutName = game.mainMap ? "mainMap" : game.level ? "levelClosed" : null;
    const wallBoxes = [];
    const layout = processedFloors[layoutName];
    if (!layout) return wallBoxes;

    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 'wall') {
                wallBoxes.push({
                    position: new Vec(x * tileSize, y * tileSize),
                    width: tileSize,
                    height: tileSize
                });
            }
        }
    }
    return wallBoxes;
}

class Boss extends AnimatedObject{
    constructor(position, width, height) {
        super("#000000", width, height, position.x, position.y, "bat");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites = {
            "attackBoss": ["../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-1.png","../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-2.png","../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-3.png", "../Videojuego/Assets/GameAssets/Bosses/boss_Dragon/Boss1-4.png"]
        };
        this.currentDirection = "fly";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 100;
        this.chaseSpeed = 0.2;
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
            "fly": ["../Videojuego/Assets/GameAssets/Enemies/enemy_Bat/Bat-1.png", "../Videojuego/Assets/GameAssets/Enemies/enemy_Bat/Bat-2.png"],
        };
        this.currentDirection = "fly";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 100;  
        this.chaseSpeed = 0.15;  
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
            "attackKnight": ["../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-1.png","../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-2.png","../Videojuego/Assets/GameAssets/Enemies/enemy_Knight/Knight-3.png"],
        };
        this.currentDirection = "attackKnight";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 300;
        this.chaseSpeed = 0.1;
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
            "attackMage": ["../Videojuego/Assets/GameAssets/Enemies/enemy_Mage/Mage-1.png","../Videojuego/Assets/GameAssets/Enemies/enemy_Mage/Mage-2.png"],
        };
        this.currentDirection = "attackMage";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 1000;
        this.chaseSpeed = 0.05;
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
            "attackSkull": ["../Videojuego/Assets/GameAssets/Enemies/enemy_Skull/Skull.png", "../Videojuego/Assets/GameAssets/Enemies/enemy_Skull/Skull2.png"]
        };
        this.currentDirection = "attackSkull";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 80;
        this.chaseSpeed = 0.1;
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
            "attackSlime": ["../Videojuego/Assets/GameAssets/Enemies/enemy_Slime/Slime-1.png","../Videojuego/Assets/GameAssets/Enemies/enemy_Slime/Slime-2.png"]
        };
        this.currentDirection = "attackSlime";
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.chaseRange = 100;
        this.chaseSpeed = 0.05;
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
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}

// Clases de proyectiles
class Bomb {
    constructor(position) {
        this.position = position;
        this.frameIndex = 0;
        this.frames = [
            "../Videojuego/Assets/GameAssets/Pickup/pickup_Bomb.png",
            "../Videojuego/Assets/GameAssets/Weapons/Bomb_2.png",
            "../Videojuego/Assets/GameAssets/Weapons/Bomb_3.png",
            "../Videojuego/Assets/GameAssets/Weapons/Bomb_4.png"
        ];
        this.image = new Image();
        this.image.src = this.frames[this.frameIndex];
        this.alive = true;

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
        this.alive = false; // dejar de dibujar
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

        this.image = new Image();
        if (direction === "up" || direction === "down") {
            this.image.src = "../Videojuego/Assets/GameAssets/Weapons/Fire_arrow_1.png";
        } else {
            this.image.src = "../Videojuego/Assets/GameAssets/Weapons/Fire_arrow_2.png";
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

        this.image = new Image();
        if (direction === "up" || direction === "down") {
            this.image.src = "../Videojuego/Assets/GameAssets/Weapons/Magic_3.png";
        } else {
            this.image.src = "../Videojuego/Assets/GameAssets/Weapons/Magic_7.png";
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

class Player extends AnimatedObject{
    constructor(position, width, height){
        super("#ff0000", width, height, position.x, position.y, "player");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites ={
            "down": ["../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_1.png", "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_2.png"],
            "right": ["../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_3.png", "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_4.png"],
            "left": ["../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_3.png", "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_4.png"],
            "up": ["../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_5.png", "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_6.png"],
            "defend": ["../Videojuego/Assets/GameAssets/Magical_shield/Magical_shield_3.png", "../Videojuego/Assets/GameAssets/Magical_shield/Magical_shield_4.png"],
            "attackSwordDown": "../Videojuego/Assets/GameAssets/White_sword/White_sword_4.png",
            "attackSwordRight": "../Videojuego/Assets/GameAssets/White_sword/White_sword_8.png",
            "attackSwordUp": "../Videojuego/Assets/GameAssets/White_sword/White_sword_12.png",
            "attackMagicDown": "../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_4.png",
            "attackMagicRight": "../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_8.png",
            "attackMagicUp": "../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_12.png",
            "attackBowDown": "../Videojuego/Assets/GameAssets/Bow/bow_down.png",
            "attackBowLeft": "../Videojuego/Assets/GameAssets/Bow/bow_left.png",
            "attackBowUp": "../Videojuego/Assets/GameAssets/Bow/bow_up.png"
        };
        this.currentDirection = "up";
        this.facingLeft = false;
        this.frameIndex = 0;
        this.image = new Image();
        this.image.src = this.sprites[this.currentDirection][this.frameIndex];
        this.animationSpeed = 150;
        this.lastFrameChange = 250;
        this.shieldActive = false;
        this.swordActive = false;
        this.magicActive = false; 
        this.bowActive = false;
    }   

    update(deltaTime) {
        if (gamePaused | interactingMerchant) return;
        
        if (!(this.position instanceof Vec)) {
            this.position = new Vec(this.position.x, this.position.y);
        }
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        let collidesWithWall = false;
        const wallBoxes = getWallBoxes("mainMap");
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
        let collidesWithOldMan = false;
        if (game.mainMap) {
            collidesWithOldMan = boxOverlap(futureBox, game.oldManBox);
        }

        let collidesWithMerchant = false;
        if (game.mainMap) {
            collidesWithMerchant = boxOverlap(futureBox, game.tienda.getHitbox());
        }
        let collidesWithChest = false;
        if (game.mainMap) {
            collidesWithChest = boxOverlap(futureBox, game.chestBox);
        }
        if (!collidesWithWall && !collidesWithOldMan && !collidesWithMerchant && !collidesWithChest) {
            this.position = nextPosition;
        }
        

        this.position.x = Math.max(0, Math.min(canvasWidth - this.width, this.position.x));
        this.position.y = Math.max(0, Math.min(canvasHeight - this.height, this.position.y));

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.lastFrameChange += deltaTime;
            if (this.lastFrameChange > this.animationSpeed) {
                this.frameIndex = (this.frameIndex + 1) % 2;
                this.image.src = this.sprites[this.currentDirection][this.frameIndex];
                this.lastFrameChange = 0;
            }
        }
    }

    draw(ctx) {
        ctx.save();
    
        let flip = this.facingLeft;
        let drawX = this.position.x;
        let drawY = this.position.y;
    
        if (this.swordActive && this.currentDirection === "left") {
            ctx.scale(-1, 1);
            drawX = -this.position.x - this.width;
        } else if (this.magicActive && this.currentDirection === "left") {
            ctx.scale(-1, 1);
            drawX = -this.position.x - this.width;
        } else if (this.bowActive && this.currentDirection === "left") {
            ctx.scale(-1, 1);
            drawX = -this.position.x - this.width;
        } else if (flip) {
            ctx.scale(-1, 1);
            drawX = -this.position.x - this.width;
        }
    
        if (this.swordActive) {
            let swordImage = new Image();
            if (this.currentDirection === "up") {
                swordImage.src = this.sprites["attackSwordUp"];
            } else if (this.currentDirection === "down") {
                swordImage.src = this.sprites["attackSwordDown"];
            } else if (this.currentDirection === "right") {
                swordImage.src = this.sprites["attackSwordRight"];
            } else if (this.currentDirection === "left") {
                swordImage.src = this.sprites["attackSwordRight"];
            }
            ctx.drawImage(swordImage, drawX, drawY, this.width, this.height);
        } else if (this.magicActive) {
            let magicImage = new Image();
            if (this.currentDirection === "up") {
                magicImage.src = this.sprites["attackMagicUp"];
            } else if (this.currentDirection === "down") {
                magicImage.src = this.sprites["attackMagicDown"];
            } else if (this.currentDirection === "right") {
                magicImage.src = this.sprites["attackMagicRight"];
            } else if (this.currentDirection === "left") {
                magicImage.src = this.sprites["attackMagicRight"];
            }
            ctx.drawImage(magicImage, drawX, drawY, this.width, this.height);
        } 
        else if (this.bowActive){
            let bowImage = new Image();
            if (this.currentDirection === "up") {
                bowImage.src = this.sprites["attackBowUp"];
            } 
            else if (this.currentDirection === "down") {
                bowImage.src = this.sprites["attackBowDown"];
            } 
            else if (this.currentDirection === "right") {
                bowImage.src = this.sprites["attackBowLeft"];
            }
            else if (this.currentDirection === "left") {
                bowImage.src = this.sprites["attackBowLeft"];
            }
            ctx.drawImage(bowImage, drawX, drawY, this.width, this.height);
        }
            
        else {
            ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
        }
    
        ctx.restore();
    }

    setDirection(direction) {
        if (this.sprites[direction] && direction !== this.currentDirection) {
            this.currentDirection = direction;
            this.frameIndex = 0;
            this.image.src = this.sprites[direction][this.frameIndex];}
    }
    toggleShield(active) {
        this.shieldActive = active; // Set whether the shield is active or not
    }
    toggleSword(active) {
        this.swordActive = active; // Set whether the sword is active or not
    }
    toggleMagic(active) {
        this.magicActive = active; // Set whether the magic is active or not
    }
    toggleBomb(active){
        this.bombActive = active; // Set whether the bomb is active or not
    }
    toggleBow(active){
        this.bowActive = active; // Set whether the bow is active or not
    }
}


// Class to keep track of all the events and objects in the game
class Game{
    constructor(){
        this.createEventListeners();
        this.initObjects();
        this.showMainMenu = true;
        this.showPrologue = false;
        this.showLoginScreen = false;
        this.showRegisterScreen = false;
        this.mainMap = false;
        this.level = false;
        this.enteredLevel = false;
        this.dialogueStage = 0;
        this.showTutorial = false;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.chestIsOpen = false;
        this.logo = new Image();
        this.logo.src = "../Videojuego/Assets/MDAssets/Three.png";
        this.chestClosed = new Image ();
        this.chestClosed.src = "../Videojuego/Assets/GameAssets/Chest/chest_closed.png";
        this.chestOpened = new Image();
        this.chestOpened.src = "../Videojuego/Assets/GameAssets/Chest/chest_open.png";
        this.chestPosition = new Vec(canvasWidth / 2 - 70, 200);
        this.chestBox = {
            position: new Vec(this.chestPosition.x, this.chestPosition.y),
            width: 32,
            height: 32
        }
        this.oldMan = new Image();
        this.oldMan.src = "../Videojuego/Assets/GameAssets/NPC/Old_man.png";
        this.oldManRight = new Image();
        this.oldManRight.src = "../Videojuego/Assets/GameAssets/NPC/Old_man_2.png";
        this.oldManBack = new Image();
        this.oldManBack.src = "../Videojuego/Assets/GameAssets/NPC/Old_man_3.png";
        this.oldManPosition = new Vec(canvasWidth / 2 +100, 200);
        this.oldManBox = {
            position: new Vec(this.oldManPosition.x, this.oldManPosition.y),
            width: 32,
            height: 32
        };
        this.bombs = [];
        this.arrows = [];
        this.magics = [];
        this.levelEnemies = [];
        this.tienda = new Tienda();
    }

    initObjects() {
        this.player = new Player(new Vec(canvasWidth / 2 - 14, 305), 32, 32);
        this.actors = [];
    }

    draw(ctx){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        if (this.showMainMenu) {
            // Dibujar el logo
            ctx.drawImage(this.logo, canvasWidth / 2 - 228, 80, 450, 450);
            showUI = false;
            // Dibujar el mensaje
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Presiona Enter para empezar el juego", canvasWidth / 2, 570);
        } else if (this.showLoginScreen){
            // Dibujar el logo
            ctx.drawImage(this.logo, canvasWidth / 2 - 228, 80, 450, 450);
            // Dibujar el cuadro del login
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 200, canvasHeight / 2 - 100, 400, 350);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 200, canvasHeight / 2 - 100, 400, 350);
            // Dibujar el formulario
            document.getElementById("loginForm").style.display = "block";
        } else if (this.showRegisterScreen){
            // Dibujar el logo
            ctx.drawImage(this.logo, canvasWidth / 2 - 228, 80, 450, 450);
            // Dibujar el cuadro del register
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 200, canvasHeight / 2, 400, 200);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 200, canvasHeight / 2, 400, 200);
            // Dibujar el formulario
            document.getElementById("registerForm").style.display = "block";
        } else if (this.showPrologue){
            drawBackground("prologue", ctx);
            // Dibujar el cuadro del prólogo
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
            // Dibujar el texto del prólogo
            ctx.fillStyle = "white";
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Prologo", canvasWidth / 2, 185);
            ctx.fillStyle = "white";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            const prologueText = [
                "La oscuridad se disipa. Sentinel despierta en un frio suelo de piedra,",
                "con el eco de gotas cayendo a su alrededor.",
                "La tenue luz de una antorcha ilumina la cueva.",
                "Se siente debil, sin recuerdos de como llego alli.",
                "Un anciano se le acerca y empieza a hablar."
            ];
            let yPosition = canvasHeight / 4 + 90;
            prologueText.forEach(line => {
                ctx.fillText(line, canvasWidth / 2, yPosition);
                yPosition += 50;
            });
            // Mensaje para continuar
            ctx.font = "20px Arial";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
        } 
        else if (this.mainMap){ 

            drawBackground("mainMap", ctx);
            // Dibuja el hombre viejo
            ctx.drawImage(this.oldMan, this.oldManPosition.x, this.oldManPosition.y, 32, 32);
            //Dibuja el npc de tienda
            this.tienda.draw(ctx); 
            if (this.chestIsOpen) {
                this.chestClosed = null;
                ctx.drawImage(this.chestOpened, this.chestPosition.x, this.chestPosition.y, 32,32);
                this.player.draw(ctx);
            } else {
                ctx.drawImage(this.chestClosed, this.chestPosition.x, this.chestPosition.y, 32,32);
            }
            this.player.draw(ctx);
            if (!rupeesInitialized) {
                initializeRupees();
                rupeesInitialized = true; // Set the flag to true after initialization
            }
            drawRupees(ctx, this.player);
            // Initialize rupees only once when entering the main map
            this.bombs.forEach(b => b.draw(ctx));
            this.arrows.forEach(a => a.draw(ctx));
            this.magics.forEach(m => m.draw(ctx));
            // Dibuja el jugador
            this.player.draw(ctx);
            if (this.dialogueStage < 5) {
                this.drawDialogue(ctx);
                // Mensaje para continuar
                ctx.font = "15px Arial";
                ctx.fillText("Presiona Enter para continuar", canvasWidth / 2 + 200, 190, 600, 100);
            } else if (this.dialogueStage === 5 && !this.tutorialWasShown) {
                this.showTutorial = true;
                this.tutorialWasShown = true;
                playerStats.bombs = 10;
                playerStats.arrows = 20;
            } else if (this.showTutorial) {
                this.drawTutorial(ctx);
            }
            if (this.player.position.y + this.player.height >= canvasHeight &&
                this.player.position.x >= canvasWidth / 2 - 50 &&
                this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
                    this.mainMap = false;
                    this.level = true;
                    this.player.position = new Vec(canvasWidth / 2 - 16, 0);
                    playerStats.level += 1;
                    rupeesInitialized=false;
                    this.levelEnemyInterval = setInterval(() => {this.spawnEnemies();}, 5000);
            }
            if (this.showInventory) {
                this.drawInventory(ctx);
            }
        } else if (this.level){
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawBackground("levelClosed", ctx);
            // Dibuja proyectiles
            this.bombs.forEach(b => b.draw(ctx));
            this.arrows.forEach(a => a.draw(ctx));
            this.magics.forEach(m => m.draw(ctx));
            this.drawEnemies(ctx);
            // Dibuja el jugador
            this.player.draw(ctx);
            if (!rupeesInitialized) {
                initializeRupees();  // Initialize rupees for level 1
                rupeesInitialized = true;  // Mark rupees as initialized
            }
    
            // Draw rupees for this level
            drawRupees(ctx, this.player);
    
            // Dibuja el inventario y tutorial si está abierto
            if (this.showInventory) {
                this.drawInventory(ctx);
            } else if (this.showTutorial) {
                this.drawTutorial(ctx);
            }
            if (this.player.position.y <= 0 &&
                this.player.position.x >= canvasWidth / 2 - 50 &&
                this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
                    
                this.level = false;
                this.mainMap = true;
                this.player.position = new Vec (canvasWidth / 2 - 16, canvasHeight - tileSize);
                playerStats.level -= 1;
                rupeesInitialized = false;

                clearInterval(this.levelEnemyInterval);
                this.levelEnemyInterval = null;
            }
        } else {
            for (let actor of this.actors){
                actor.draw(ctx);
            }
            this.player.draw(ctx);
        }
        if (gamePaused) {
            drawPauseMenu(ctx);
        }
        if (interactingNPC){
            drawNPCTutorial(ctx);
        }
        if (interactingMerchant) {
            this.tienda.drawDialogue(ctx);
        }
    }

    drawDialogue(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, 70, 600, 100);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, 70, 600, 100);
        
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        
        let dialogueTexts = [
            ["Por fin has despertado, joven heroe!"],
            ["Tu hermano ha sido capturado", "por el Ejercito de la Oscuridad!"],
            ["Ha sido llevado a su fortaleza en los ultimos cuartos de esta mazmorra,", "donde su lider..."],
            ["El Rey Aquamentus!"],
            ["Te doy unas armas para empezar tu exploracion.", "Intenta visitar a la tienda para mejorar tus habilidades."]
        ];
        let lines = dialogueTexts[this.dialogueStage];
        let yPosition = 110;
        lines.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 25;
        });
    }

    drawTutorial(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, 100, 600, 400);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, 100, 600, 400);

        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Tutorial de Controles", canvasWidth / 2, 150);

        const controls = [
            "Flechas = Moverse",
            "Z = Atacar con espada",
            "X = Atacar con arco",
            "A = Dejar bomba",
            "C = Atacar con magia",
            "D = Tomar pocion",
            "Shift = Defender con escudo",
            "I = Abrir inventario",
            "ESC = Menu de pausa",
            "SPACE = Interactuar con NPCs",
            "O = Interactuar con cofres",
            "T = Abrir tutorial"
        ];

        let yPosition = 200;
        ctx.font = "18px Arial";
        controls.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 30;
        });

        ctx.font = "20px Arial";
        ctx.fillText("Presiona T para continuar", canvasWidth / 2, 530);
    }

    drawInventory(ctx) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.9;
        ctx.fillRect(canvasWidth / 2 - 150, canvasHeight / 2 + 80, 300, 180);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 150, canvasHeight / 2 + 80, 300, 180);
    
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Inventario", canvasWidth / 2, canvasHeight / 2 + 110);
    
        ctx.drawImage(arrowImg, canvasWidth / 2 - 40, canvasHeight / 2 + 120, 24, 48);
        ctx.fillText(`x${playerStats.arrows}`, canvasWidth / 2 + 20, canvasHeight / 2 + 150);
        ctx.drawImage(bombIcon, canvasWidth / 2 - 40, canvasHeight / 2 + 160, 24, 48);
        ctx.fillText(`x${playerStats.bombs}`, canvasWidth / 2 + 20, canvasHeight / 2 + 200);
    
        ctx.font = "16px Arial";
        ctx.fillText("Presiona I para cerrar", canvasWidth / 2, canvasHeight / 2 + 250);
    
        ctx.restore();
    }

    update(deltaTime){
        if (!this.showMainMenu && !this.showPrologue) {
            if (this.level) {
                this.levelEnemies.forEach(enemy => enemy.update(deltaTime, this.player.position));
            } else {
                this.actors.forEach(actor => actor.update(deltaTime, this.player.position));
            }
            this.player.update(deltaTime);
            this.arrows.forEach(a => a.update(deltaTime));
            this.arrows = this.arrows.filter(a => a.alive !== false);
            this.magics.forEach(m => m.update(deltaTime));
            this.magics = this.magics.filter(m => m.alive !== false);
        }
    }

    createEventListeners(){
        window.addEventListener('keydown', (event) =>{
            if (this.showMainMenu && event.key === 'Enter') {
                this.showMainMenu = false;
                this.showLoginScreen = true;
                this.mainMap = false;
                return;
            }    
            if (this.showPrologue && event.key === 'Enter') {
                this.showPrologue = false;
                this.mainMap = true;
                return;
            }
            if (this.mainMap && this.dialogueStage < 5 && event.key === 'Enter') {
                this.dialogueStage++;
                return;
            }
            if (this.mainMap && this.dialogueStage === 5 && !this.showTutorial && !this.tutorialWasShown) {
                this.showTutorial = true;
                this.tutorialWasShown = true;
                return;
            }
            if (this.showTutorial && event.key === 't') {
                this.showTutorial = false;
                return;
            }
            if (!this.showTutorial && event.key === 't') {
                this.showTutorial = true;
                return;
            }
            if (event.key === 'i' && this.showInventory) {
                this.showInventory = false;
                return;
            }
            if (event.key === 'i' && !this.showInventory && !this.showTutorial) {
                this.showInventory = true;
                return;
            }
            if ((this.mainMap || this.level) && this.dialogueStage >= 5 && !this.showTutorial) {
                if (event.key == 'ArrowUp') {
                    this.player.velocity.y = -playerSpeed;
                    this.player.setDirection("up");
                } else if (event.key == 'ArrowLeft') {
                    this.player.velocity.x = -playerSpeed;
                    this.player.setDirection("left");
                    this.player.facingLeft = true;
                } else if (event.key == 'ArrowDown') {
                    this.player.velocity.y = playerSpeed;
                    this.player.setDirection("down");
                } else if (event.key == 'ArrowRight') {
                    this.player.velocity.x = playerSpeed;
                    this.player.setDirection("right");
                    this.player.facingLeft = false;
                }
                else if (event.key == "Shift") {
                    this.player.toggleShield(true);  // Enable shield
                }
                else if(event.key=="z"){
                    this.player.toggleSword(true);  
                }
                else if(event.key=="c"){
                    if (playerStats.mana > 0) {
                        playerStats.mana -= 10;
                        this.player.toggleMagic(true);
                        
                        let offset = new Vec(0, 0);
                        if (this.player.currentDirection === "up") offset = new Vec(0, -tileSize);
                        if (this.player.currentDirection === "down") offset = new Vec(0, tileSize);
                        if (this.player.currentDirection === "left") offset = new Vec(-tileSize, 0);
                        if (this.player.currentDirection === "right") offset = new Vec(tileSize, 0);
                    
                        let magicPos = this.player.position.plus(offset);
                        this.magics.push(new Magic(magicPos, this.player.currentDirection));
                    } else {
                        this.player.toggleMagic(true);
                    }
                }
                else if(event.key == "x"){
                    if (playerStats.arrows > 0) {
                        playerStats.arrows--;
                        this.player.toggleBow(true);
                        
                        let offset = new Vec(0, 0);
                        if (this.player.currentDirection === "up") offset = new Vec(0, -tileSize);
                        if (this.player.currentDirection === "down") offset = new Vec(0, tileSize);
                        if (this.player.currentDirection === "left") offset = new Vec(-tileSize, 0);
                        if (this.player.currentDirection === "right") offset = new Vec(tileSize, 0);
                    
                        let arrowPos = this.player.position.plus(offset);
                        this.arrows.push(new Arrow(arrowPos, this.player.currentDirection));
                    } else {
                        this.player.toggleBow(true);
                    }
                }else if (event.key == "a") {
                    if (playerStats.bombs > 0) {
                        playerStats.bombs--;
                        this.player.toggleBomb(true);
                        
                        let offset = new Vec(0, 0);
                        if (this.player.currentDirection === "up") offset = new Vec(0, 32);
                        if (this.player.currentDirection === "down") offset = new Vec(0, -32);
                        if (this.player.currentDirection === "left") offset = new Vec(32, 0);
                        if (this.player.currentDirection === "right") offset = new Vec(-32, 0);
                
                        let bombPos = this.player.position.plus(offset);
                        this.bombs.push(new Bomb(bombPos));
                    } else {
                        this.player.toggleBomb(false);
                    }
                } 
            }
            if (event.key == "o") {
                if (this.mainMap) {
                    const playerNearChest = this.player.position.x > this.chestPosition.x - 36 &&
                        this.player.position.x < this.chestPosition.x + 36 &&
                        this.player.position.y > this.chestPosition.y - 36 &&
                        this.player.position.y < this.chestPosition.y + 36;
            
                    if (playerNearChest && !this.chestHasBeenOpened) { 
                        this.chestIsOpen = !this.chestIsOpen;
            
                        if (this.chestIsOpen) {
                            let item = Math.random();
                            if (item <= 0.33) {
                                playerStats.bombs += 1;
                            } else if (item <= 0.66) {
                                playerStats.arrows += 1;
                            } else {
                                playerStats.potions += 1;
                            }
                            this.chestHasBeenOpened = true;
                        }
                    }
                }
            }
            if (event.key == "d") {
                if (playerStats.potions > 0 && playerStats.life < 100){
                    playerStats.potions--;
                    //random life regeneration 
                    let lifeRegen = Math.floor(Math.random() * 20) + 10;
                    playerStats.life += lifeRegen;
                }
            }
            
            if (event.key === "Escape") {
                gamePaused = !gamePaused;
            }

            if (event.key === " "){
                    if (this.mainMap) {

                    if (
                        document.getElementById("purchaseDialog").style.display !== "none" ||
                        document.getElementById("errorDialog").style.display !== "none" ||
                        document.getElementById("loginForm").style.display !== "none" ||
                        document.getElementById("registerForm").style.display !== "none"
                    ) {
                        return; 
                    }
                    const playerNearNPC = this.player.position.x > this.oldManPosition.x - 36 &&
                    this.player.position.x < this.oldManPosition.x + 36 &&
                    this.player.position.y > this.oldManPosition.y - 36 &&
                    this.player.position.y < this.oldManPosition.y + 36;

                    if (playerNearNPC) {
                        interactingNPC = !interactingNPC;
                    }

                    const playerNearMerchant = this.player.position.x > this.tienda.position.x - 36 &&
                    this.player.position.x < this.tienda.position.x + 36 &&
                    this.player.position.y > this.tienda.position.y - 36 &&
                    this.player.position.y < this.tienda.position.y + 36;

                    if (playerNearMerchant) {
                        if (!interactingMerchant) {
                            interactingMerchant = true;
                        } else {
                            if (game.tienda.dialogueStage < game.tienda.dialogueTexts.length - 1) {
                                game.tienda.nextDialogue();
                            } else {
                                interactingMerchant = false;
                                game.tienda.dialogueStage = 0;
                            }
                        }
                    }
                }
            }
        });

        window.addEventListener('keyup', (event) => {
            if ((this.mainMap || this.level) && !this.showTutorial) {
                if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
                    this.player.velocity.y = 0;
                } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                    this.player.velocity.x = 0;
                }
                else if (event.key == "Shift") {
                    this.player.toggleShield(false);  // Disable shield
                }
                else if(event.key=="z"){
                    this.player.toggleSword(false); 
                }
                else if(event.key=="c"){
                    this.player.toggleMagic(false);  
                }
                else if(event.key == "x"){
                    this.player.toggleBow(false);  // Disable shield
                }
            }
        });

        document.getElementById("loginButton").addEventListener("click", () => {
            let username = document.getElementById("usernameInput").value;
            let password = document.getElementById("passwordInput").value;
            let errorDiv = document.getElementById("loginError");

            if (username && password) {
                document.getElementById("loginForm").style.display = "none";
                this.showLoginScreen = false;
                this.showPrologue = true;
            } else {
                errorDiv.innerText = "Por favor, llena todos los campos";
                return;
            }
            errorDiv.innerText = "";
        });

        document.getElementById("registerButton").addEventListener("click", () => {
            document.getElementById("loginForm").style.display = "none";
            this.showLoginScreen = false;
            this.showRegisterScreen = true;
            document.getElementById("registerForm").style.display = "block";
        });

        document.getElementById("confirmRegisterButton").addEventListener("click", () => {
            let regUsername = document.getElementById("registerUsername").value;
            let regPassword = document.getElementById("registerPassword").value;
            let confirmRegPassword = document.getElementById("confirmRegisterPassword").value;
            let errorDiv = document.getElementById("registerError");
            if (!regUsername || !regPassword || !confirmRegPassword) {
                errorDiv.innerText = "Por favor, llena todos los campos";
                return;
            }
            if (regPassword !== confirmRegPassword) {
                errorDiv.innerText = "Las contrasenas no coinciden";
                return;
            }
            errorDiv.innerText = "";
            document.getElementById("registerForm").style.display = "none";
            this.showRegisterScreen = false;
            this.showLoginScreen = true;
            document.getElementById("loginForm").style.display = "block";
        });

        document.getElementById("returnLoginButton").addEventListener("click", () => {
            document.getElementById("registerForm").style.display = "none";
            this.showRegisterScreen = false;
            this.showLoginScreen = true;
            document.getElementById("loginForm").style.display = "block";
        });

        let currentItemType = "";

        const canvas = document.getElementById('canvas');
        canvas.addEventListener('click', (event) => {
            if (interactingMerchant && game.tienda.dialogueStage === 0 && game.tienda.buttonPositions) {
                let rect = canvas.getBoundingClientRect();
                let scaleX = canvas.width / rect.width;
                let scaleY = canvas.height / rect.height;
                let clickX = (event.clientX - rect.left) * scaleX;
                let clickY = (event.clientY - rect.top) * scaleY;
            
                let btn1 = game.tienda.buttonPositions.button1;
                let btn2 = game.tienda.buttonPositions.button2;
                let btn3 = game.tienda.buttonPositions.button3;
            
                if (clickX >= btn1.x && clickX <= btn1.x + btn1.width &&
                    clickY >= btn1.y && clickY <= btn1.y + btn1.height) {
                    currentItemType = "pociones";
                    showPurchaseDialog(currentItemType);
                } else if (clickX >= btn2.x && clickX <= btn2.x + btn2.width &&
                           clickY >= btn2.y && clickY <= btn2.y + btn2.height) {
                    currentItemType = "flechas";
                    showPurchaseDialog(currentItemType);
                } else if (clickX >= btn3.x && clickX <= btn3.x + btn3.width &&
                           clickY >= btn3.y && clickY <= btn3.y + btn3.height) {
                    currentItemType = "bombas";
                    showPurchaseDialog(currentItemType);
                }
            }
        });

        document.getElementById("purchaseButton").addEventListener("click", () => {
            let purchaseInput = document.getElementById("purchaseQuantity");
            let qtyStr = purchaseInput.value.trim();
            if (qtyStr === "" || isNaN(parseInt(qtyStr))) {
                let errorDialog = document.getElementById("errorDialog");
                let errorMessage = document.getElementById("errorMessage");
                errorMessage.innerText = "No se ingresó cantidad. Compra cancelada.";
                errorDialog.style.display = "block";
                document.getElementById("purchaseDialog").style.display = "none";
                return;
            }

            let qty = parseInt(qtyStr);

            let price = 0;
            if (currentItemType === "pociones") {
                price = 20;
            } else if (currentItemType === "flechas") {
                price = 7;
            } else if (currentItemType === "bombas") {
                price = 5;
            }
            
            let totalCost = price * qty;

            if (playerStats.rupees < totalCost) {
                let errorDialog = document.getElementById("errorDialog");
                let errorMessage = document.getElementById("errorMessage");
                errorMessage.innerText = "No tienes suficientes rupias para esta compra.";
                errorDialog.style.display = "block";
                document.getElementById("purchaseDialog").style.display = "none";
                interactingMerchant = false;
                game.tienda.dialogueStage = 0;
                return;
            }
            
            if (currentItemType === "pociones") {
                playerStats.potions += qty;
            } else if (currentItemType === "flechas") {
                playerStats.arrows += qty;
            } else if (currentItemType === "bombas") {
                playerStats.bombs += qty;
            }

            playerStats.rupees -= totalCost;
            document.getElementById("purchaseDialog").style.display = "none";
        });

        document.getElementById("cancelButton").addEventListener("click", () => {
            document.getElementById("purchaseDialog").style.display = "none";
        });

        document.getElementById("errorOkButton").addEventListener("click", () => {
            document.getElementById("errorDialog").style.display = "none";
        });

        document.getElementById("purchaseQuantity").addEventListener("input", function() {
            let value = parseInt(this.value);
            if (value < 1) {
                this.value = 1;
            } else if (value > 20) {
                this.value = 20;
            }
        });    
    }

    resetGame() {
        this.showMainMenu = true;
        this.showPrologue = false;
        this.showLoginScreen = false;
        this.mainMap = false;
        this.dialogueStage = 0;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.initializeRupees = false;
        this.initObjects();

        playerStats.level = 0;
        playerStats.life = 100;
        playerStats.mana = 100;
        playerStats.rupees = 0;
        playerStats.potions = 0;
        playerStats.arrows = 0;
        playerStats.bombs = 0;
    }
}

function processBackgroundLayout(layoutName) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    const result = [];
    for (let y = 0; y < layout.length; y++) {
        const row = [];
        for (let x = 0; x < layout[y].length; x++) {
            const char = layout[y][x];
            if (char === '#') {
                row.push('wall');
            } else if (char === '-') {
                row.push('door');
            } else {
                const rand = Math.random();
                row.push(rand < 0.1 ? 'floor1' : 'floor2');
            }
        }
        result.push(row);
    }
    processedFloors[layoutName] = result;
}
function drawBackground(layoutName, ctx) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    const floorData = processedFloors[layoutName];
    if (!layout || !floorData) return;
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            const type = floorData[y][x];
            const posX = x * tileSize;
            const posY = y * tileSize;
            if (type === 'wall') {
                ctx.drawImage(wallTile, posX, posY, tileSize, tileSize);
            } else if (type === 'floor1') {
                ctx.drawImage(floorTile1, posX, posY, tileSize, tileSize);
            } else if (type === 'floor2') {
                ctx.drawImage(floorTile2, posX, posY, tileSize, tileSize);
            } else if (type === 'door') {
                ctx.drawImage(floorDoor, posX, posY, tileSize, tileSize);
            }
        }
    }
}

// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    const uiCanvas = document.getElementById("uiCanvas");
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d')
    uiCtx = uiCanvas.getContext("2d");

    processBackgroundLayout("prologue");
    processBackgroundLayout("mainMap");
    processBackgroundLayout("levelClosed");

    // Create the game object
    game = new Game();

    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    drawUI();
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
function drawUI() {
    uiCtx.clearRect(0, 0, canvasWidth, 150);
    uiCtx.fillStyle = "white";
    uiCtx.font = "20px Arial";
    uiCtx.textAlign = "left";

    // Draw stats with icons
    uiCtx.drawImage(rupeeImg, 140, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.rupees}`, 160, 100);

    uiCtx.fillText(`H P`, 20, 80);
    uiCtx.fillText(`x ${playerStats.life}`, 60, 80);
    uiCtx.fillText(`M P`, 20, 120);
    uiCtx.fillText(`x ${playerStats.mana}`, 60, 120);

    uiCtx.drawImage(potionImg, 230, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.potions}`, 250, 100);

    uiCtx.fillText(`LEVEL - ${playerStats.level}`, 100, 40);
}

function drawPauseMenu(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSADO", canvasWidth / 2, canvasHeight / 2 - 50);
    ctx.fillText("Presione SPACE para continuar", canvasWidth / 2, canvasHeight / 2);
    ctx.fillText("Presione ESC para salir a menu principal", canvasWidth / 2, canvasHeight / 2);

    ctx.restore();
}

function drawNPCTutorial(ctx) {
    const boxY = canvasHeight - 100;
    const boxHeight = 200;
    const textY = boxY + boxHeight - 170;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 150, canvasHeight - 100, 300, 200);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 150, canvasHeight - 100, 300, 200); // draw border
    
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Corre, Sentinel. Una aventura te espera.", canvasWidth / 2, textY); // centered text inside the box
    ctx.fillText("(presione space para cerrar)", canvasWidth / 2, textY + 40); // centered text inside the box
    ctx.restore();
}

function Tienda() {
    this.image = new Image();
    this.image.src = "../Videojuego/Assets/GameAssets/NPC/Merchant_1.png";
    this.shopItemsImage = new Image();
    this.shopItemsImage.src = "../Videojuego/Assets/GameAssets/NPC/Item_shop.png";
    this.position = new Vec(canvasWidth / 2 - 200, 200);
    this.width = 32;
    this.height = 32;
    this.box = {
        position: new Vec(this.position.x, this.position.y),
        width: this.width,
        height: this.height
    };
    this.dialogueTexts = [
        ["Bienvenido a mi tienda"]
    ];
    this.dialogueStage = 0;
}

Tienda.prototype.draw = function(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
};

Tienda.prototype.drawDialogue = function(ctx) {
    let boxWidth = 320;
    let boxHeight = 180;
    let boxX = this.position.x - ((boxWidth - this.width) / 2);
    let boxY = this.position.y - boxHeight - 10;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";

    let texts = this.dialogueTexts[this.dialogueStage];
    let lineHeight = 25;
    let startY = boxY + 25;
    
    for (let i = 0; i < texts.length; i++) {
        ctx.fillText(texts[i], boxX + boxWidth / 2, startY + i * lineHeight);
    }

    let scaledWidth = boxWidth - 10;
    let scaledHeight = 120;
    let imgX = boxX + 5;
    let imgY = boxY + 25;
    ctx.drawImage(this.shopItemsImage, imgX, imgY, scaledWidth, scaledHeight);
    let itemButtonWidth = 80;
    let itemButtonHeight = 24;
    let firstButtonX = boxX + 20;
    let buttonY = imgY + scaledHeight - 20;
    let secondButtonX = firstButtonX + 100;
    let thirdButtonX = secondButtonX + 100;
    
    // Botón 1
    ctx.fillStyle = "#222";
    ctx.fillRect(firstButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(firstButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    
    // Botón 2
    ctx.fillStyle = "#222";
    ctx.fillRect(secondButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeRect(secondButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    
    // Botón 3
    ctx.fillStyle = "#222";
    ctx.fillRect(thirdButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeRect(thirdButtonX, buttonY, itemButtonWidth, itemButtonHeight);

    this.buttonPositions = {
        button1: { x: firstButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight },
        button2: { x: secondButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight },
        button3: { x: thirdButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight }
    };

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("COMPRAR", firstButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.fillText("COMPRAR", secondButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.fillText("COMPRAR", thirdButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.restore();   

    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    let instruction;
    if (this.dialogueStage < this.dialogueTexts.length - 1) {
        instruction = "Presiona space para continuar";
    } else {
        instruction = "Presiona space para cerrar";
    }
    ctx.fillText(instruction, boxX + boxWidth / 2, boxY + boxHeight - 10);
    
    ctx.restore();
};

Tienda.prototype.nextDialogue = function() {
    if (this.dialogueStage < this.dialogueTexts.length - 1) {
        this.dialogueStage++;
    }
};

Tienda.prototype.getHitbox = function() {
    return {
         position: new Vec(this.position.x, this.position.y),
         width: this.width,
         height: this.height
    };
};

function showPurchaseDialog(itemType) {
    let purchaseDialog = document.getElementById("purchaseDialog");
    let purchaseMessage = document.getElementById("purchaseMessage");
    purchaseMessage.innerText = "¿Cuántas " + itemType + " deseas comprar?";
    document.getElementById("purchaseQuantity").value = "1";
    purchaseDialog.style.display = "block";
    //test
}

// Enemigos
Game.prototype.spawnEnemies = function() {
    const margin = 40;
    const enemyTypes = [Bat, Knight, Mage, Skull, Slime];
    const numEnemies = 1;

    const enemyList = this.level ? this.levelEnemies : this.actors;
    const enemyCount = enemyList.filter(actor =>
        actor instanceof Bat ||
        actor instanceof Knight ||
        actor instanceof Mage ||
        actor instanceof Skull ||
        actor instanceof Slime
    ).length;
    if (enemyCount >= 5) return;

    for (let i = 0; i < numEnemies; i++) {
        const xPos = Math.floor(Math.random() * (canvasWidth - 2 * margin - 32)) + margin;
        const yPos = Math.floor(Math.random() * (canvasHeight - 2 * margin - 32)) + margin;
        const EnemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const newEnemy = new EnemyClass(new Vec(xPos, yPos), 32, 32);
        this.levelEnemies.push(newEnemy);
    }
    
};
Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        enemy.draw(ctx);
    });
};


let rupees = [];  // Store rupee positions
let rupeesInitialized = false; // Flag to track initialization

// Function to initialize or reset rupees
function initializeRupees() {
    // Random number of rupees between 5 and 10
    const numSprites = Math.floor(Math.random() * 6) + 5;

    rupees = [];  // Reset the rupee array

    const margin = 40; // Set a margin from the edges

    // Create rupees at random positions, ensuring they are not too close to the perimeter
    for (let i = 0; i < numSprites; i++) {
        const xPos = Math.floor(Math.random() * (canvas.width - 2 * margin - 36)) + margin; // Random x position within the margin
        const yPos = Math.floor(Math.random() * (canvas.height - 2 * margin - 36)) + margin; // Random y position within the margin

        // Store the valid rupee's position
        rupees.push({ x: xPos, y: yPos });
    }
}

function drawRupees(ctx, player) {
    // Draw rupees at their positions
    for (let i = 0; i < rupees.length; i++) {
        const rupee = rupees[i];

        // Draw the rupee at its position
        ctx.drawImage(rupeeImg, rupee.x, rupee.y, 16, 16);

        // Check if player is near the rupee
        const playerNearRupee =
            player.position.x > rupee.x - 16 && player.position.x < rupee.x + 16 &&
            player.position.y > rupee.y - 16 && player.position.y < rupee.y + 16;

        if (playerNearRupee) {
            // Remove the rupee by splicing it from the array
            rupees.splice(i, 1);
            i--; // Adjust index because we removed an element
            playerStats.rupees += 1; // Increase player's rupee count

            // Optional: Play a sound or add an animation when a rupee is collected
        }
    }
}