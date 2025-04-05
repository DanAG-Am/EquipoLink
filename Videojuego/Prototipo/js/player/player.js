/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

//clase player con los metodos de ataque, dano, direcciones segun su sprite, update, dibujar y checar colisiones para evitar un overlap.
class Player extends AnimatedObject{
    constructor(position, width, height){
        super("#ff0000", width, height, position.x, position.y, "player");
        this.position = new Vec(position.x, position.y);
        this.velocity = new Vec(0, 0);
        this.sprites ={
            "down": ["../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_1.png", "../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_2.png"],
            "right": ["../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_3.png", "../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_4.png"],
            "left": ["../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_3.png", "../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_4.png"],
            "up": ["../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_5.png", "../../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_6.png"],
            "defend": ["../../Videojuego/Assets/GameAssets/Magical_shield/Magical_shield_3.png", "../../Videojuego/Assets/GameAssets/Magical_shield/Magical_shield_4.png"],
            "attackSwordDown": "../../Videojuego/Assets/GameAssets/White_sword/White_sword_4.png",
            "attackSwordRight": "../../Videojuego/Assets/GameAssets/White_sword/White_sword_8.png",
            "attackSwordUp": "../../Videojuego/Assets/GameAssets/White_sword/White_sword_12.png",
            "attackMagicDown": "../../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_4.png",
            "attackMagicRight": "../../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_8.png",
            "attackMagicUp": "../../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_12.png",
            "attackBowDown": "../../Videojuego/Assets/GameAssets/Bow/bow_down.png",
            "attackBowLeft": "../../Videojuego/Assets/GameAssets/Bow/bow_left.png",
            "attackBowUp": "../../Videojuego/Assets/GameAssets/Bow/bow_up.png"
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
        if (gamePaused || interactingMerchant || interactingNPC || interactingFairy) return;
        
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
    
        let layoutName = null;
        if (game.mainMap) layoutName = "mainMap";
        else if (game.level) layoutName = "levelClosed";
        else if (game.level2) layoutName = "level_2";
        else if (game.level3) layoutName = "level_3";
        else if (game.restRoom1) layoutName = "restRoom1";
        else if (game.level4) layoutName = "level_4";
    
        const wallBoxes = layoutName ? getWallBoxes(layoutName) : [];
    
        for (let wall of wallBoxes) {
            if (boxOverlap(futureBox, wall)) {
                collidesWithWall = true;
                break;
            }
        }
    
        let collidesWithOldMan = false;
        if (game.mainMap) {
            collidesWithOldMan = boxOverlap(futureBox, game.oldMan.getHitbox());
        }
    
        let collidesWithMerchant = false;
        if (game.mainMap || game.restRoom1) {
            collidesWithMerchant = boxOverlap(futureBox, game.tienda.getHitbox());
        }
    
        let collidesWithLevelChest = false;
        if (game.level && game.levelCompleted && game.levelChestBox) {
            collidesWithLevelChest = boxOverlap(futureBox, game.levelChestBox);
        }
    
        let collidesWithFairy = false;
        if (game.mainMap || game.restRoom1) {
            collidesWithFairy = boxOverlap(futureBox, game.fairy.getHitbox());
        }
    
        if (!collidesWithWall && !collidesWithOldMan && !collidesWithMerchant && !collidesWithLevelChest && !collidesWithFairy) {
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