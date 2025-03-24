/*
 * Simple animation on the HTML canvas
 *
 * TeamLink
 * 2025-02-19
 */

"use strict";

const canvasWidth = 800;
const canvasHeight = 600;
let ctx, uiCtx, game;
let oldTime;
let playerSpeed = 0.25;
let showUI = false;
let gamePaused = false;
const bottomBar1 = new GameObject(new Vec(0, canvasHeight - 20), canvasWidth / 2 - 50, 20, "orange", "obstacle");
const bottomBar2 = new GameObject(new Vec(canvasWidth / 2 + 50, canvasHeight - 20), canvasWidth / 2 - 50, 20, "orange", "obstacle");
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
    rupees: 0,
    potions: 0,
    arrows: 0,
    bombs: 0
};

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
    }   

    update(deltaTime) {
        if (gamePaused) return;
        
        if (!(this.position instanceof Vec)) {
            this.position = new Vec(this.position.x, this.position.y);
        }
        let nextPosition = this.position.plus(this.velocity.times(deltaTime));
        let futureBox = {
            position: nextPosition,
            width: this.width,
            height: this.height
        };
        if (!boxOverlap(futureBox, game.oldManBox)) {
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
        } else {
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
        this.dialogueStage = 0;
        this.showTutorial = false;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.logo = new Image();
        this.logo.src = "../Videojuego/Assets/MDAssets/Three.png";
        this.oldMan = new Image();
        this.oldMan.src = "../Videojuego/Assets/GameAssets/NPC/Old_man.png";
        this.oldManRight = new Image();
        this.oldManRight.src = "../Videojuego/Assets/GameAssets/NPC/Old_man_2.png";
        this.oldManBack = new Image();
        this.oldManBack.src = "../Videojuego/Assets/GameAssets/NPC/Old_man_3.png";
        this.oldManPosition = new Vec(canvasWidth / 2 - 14, 200);
        this.oldManBox = {
            position: new Vec(this.oldManPosition.x, this.oldManPosition.y),
            width: 32,
            height: 32
        };
        this.bombs = [];
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
            // Dibujar el cuadro del prólogo
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 340, canvasHeight / 2 - 180, canvasWidth / 4 + 480, canvasHeight / 2 + 70);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 340, canvasHeight / 2 - 180, canvasWidth / 4 + 480, canvasHeight / 2 + 70);
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
        } else if (this.mainMap){
            // Dibuja el hombre viejo
            ctx.drawImage(this.oldMan, this.oldManPosition.x, this.oldManPosition.y, 32, 32);
            this.bombs.forEach(b => b.draw(ctx));
            // Dibuja el jugador
            this.player.draw(ctx);
            // Dibuja la puerta
            bottomBar1.draw(ctx);
            bottomBar2.draw(ctx);
            if (this.dialogueStage < 5) {
                this.drawDialogue(ctx);
                // Mensaje para continuar
                ctx.font = "15px Arial";
                ctx.fillText("Presiona Enter para continuar", canvasWidth / 2 + 200, 190, 600, 100);
            } else if (this.dialogueStage === 5 && !this.tutorialWasShown) {
                this.showTutorial = true;
                this.tutorialWasShown = true;
                playerStats.bombs = 10;
            } else if (this.showTutorial) {
                this.drawTutorial(ctx);
            }
            if (this.player.position.y + this.player.height >= canvasHeight &&
                this.player.position.x >= canvasWidth / 2 - 50 &&
                this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
                    alert("You have left the cave. The demo game is over.");
                    this.resetGame();
            }
            if (this.showInventory) {
                this.drawInventory(ctx);
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
            "Shift = Defender con escudo",
            "I = Abrir inventario",
            "ESC = Menu de pausa",
            "SPACE = Interactuar con NPCs/Cofres",
            "T = Abrir tutorial"
        ];

        let yPosition = 200;
        ctx.font = "18px Arial";
        controls.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 30;
        });

        ctx.font = "20px Arial";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 530);
    }

    drawInventory(ctx) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.9;
        ctx.fillRect(canvasWidth / 2 - 150, canvasHeight / 2 - 100, 300, 200);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 150, canvasHeight / 2 - 100, 300, 200);
    
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Inventario", canvasWidth / 2, canvasHeight / 2 - 60);
    
        ctx.drawImage(arrowImg, canvasWidth / 2 - 40, canvasHeight / 2 - 30, 24, 48);
        ctx.fillText(`x${playerStats.arrows}`, canvasWidth / 2 + 20, canvasHeight / 2);
        ctx.drawImage(bombIcon, canvasWidth / 2 - 40, canvasHeight / 2 + 10, 24, 48);
        ctx.fillText(`x${playerStats.bombs}`, canvasWidth / 2 + 20, canvasHeight / 2 + 50);
    
        ctx.font = "16px Arial";
        ctx.fillText("Presiona I para cerrar", canvasWidth / 2, canvasHeight / 2 + 90);
    
        ctx.restore();
    }

    update(deltaTime){
        if (!this.showMainMenu && !this.showPrologue) {
            for (let actor of this.actors){
                actor.update(deltaTime);
            }
            this.player.update(deltaTime);
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
            if (this.showTutorial && event.key === 'Enter') {
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
            if (event.key === 'i' && this.mainMap && !this.showInventory && !this.showTutorial) {
                this.showInventory = true;
                return;
            }
            if (this.mainMap && this.dialogueStage >= 5 && !this.showTutorial) {
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
                    this.player.toggleMagic(true);  
                }
                else if (event.key == "a") {
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
            if (event.key === "Escape") {
                gamePaused = !gamePaused;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (this.mainMap && !this.showTutorial) {
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
        
    }

    resetGame() {
        this.showMainMenu = true;
        this.showPrologue = false;
        this.showLoginScreen = false;
        this.mainMap = false;
        this.dialogueStage = 0;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.initObjects();

        playerStats.level = 0;
        playerStats.life = 100;
        playerStats.rupees = 0;
        playerStats.potions = 0;
        playerStats.arrows = 0;
        playerStats.bombs = 0;
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
    uiCtx.clearRect(0, 0, canvasWidth, 60);
    uiCtx.fillStyle = "white";
    uiCtx.font = "20px Arial";
    uiCtx.textAlign = "left";

    // Draw stats with icons
    uiCtx.drawImage(rupeeImg, 120, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.rupees}`, 140, 100);

    uiCtx.drawImage(heartImg, 30, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.life}`, 50, 100);

    uiCtx.drawImage(potionImg, 210, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.potions}`, 230, 100);

    uiCtx.fillText(`LEVEL - ${playerStats.level}`, 100, 60);
}
function drawPauseMenu(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvasWidth / 2, canvasHeight / 2 - 50);
    ctx.fillText("Press ESC to resume", canvasWidth / 2, canvasHeight / 2);

    ctx.restore();
}