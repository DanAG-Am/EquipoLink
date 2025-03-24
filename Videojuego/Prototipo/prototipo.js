/*
 * Simple animation on the HTML canvas
 *
 * TeamLink
 * 2025-02-19
 */

"use strict";

const canvasWidth = 800;
const canvasHeight = 600;
let ctx, game;
let oldTime;
let playerSpeed = 0.25;
let gamePaused = false;
const bottomBar1 = new GameObject(new Vec(0, canvasHeight - 20), canvasWidth / 2 - 50, 20, "orange", "obstacle");
const bottomBar2 = new GameObject(new Vec(canvasWidth / 2 + 50, canvasHeight - 20), canvasWidth / 2 - 50, 20, "orange", "obstacle");

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
            "attackSword": ["../Videojuego/Assets/GameAssets/Magical_sword/Magical_sword_5.png", "../Videojuego/Assets/GameAssets/Magical_sword/Magical_sword_8.png"],
            "attackMagic": ["../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_5.png","../Videojuego/Assets/GameAssets/Magical_rod/Magical_rod_8.png"],
            "leaveBomb": ["../Videojuego/Assets/GameAssets/Pick_up_item/Pick_up_item_1.png","../Videojuego/Assets/GameAssets/Pickup/pickup_Bomb.png"]
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
        this.bombActive = false;
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

    draw(ctx){
        ctx.save();
        if (this.facingLeft){
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -this.position.x - this.width, this.position.y, this.width, this.height);
            if (this.shieldActive) {
                let shieldImage = new Image();
                shieldImage.src = this.sprites["defend"][this.frameIndex];
                ctx.drawImage(shieldImage, -this.position.x - this.width, this.position.y, this.width, this.height);
            }
            if(this.swordActive){
                let swordImage = new Image();
                swordImage.src = this.sprites["attackSword"][this.frameIndex];
                ctx.drawImage(swordImage, -this.position.x - this.width, this.position.y, this.width, this.height);
            }
            if(this.magicActive){
                let magicImage = new Image();
                magicImage.src = this.sprites["attackMagic"][this.frameIndex];
                ctx.drawImage(magicImage, -this.position.x - this.width, this.position.y, this.width,this.height);
            }
            if(this.bombActive){
                let bombImage = new Image();
                bombImage.src = this.sprites["leaveBomb"][this.frameIndex];
                ctx.drawImage(bombImage, -this.position.x - this.width, this.position.y, this.width,this.height);

            }
        } else {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        if (this.shieldActive) {
            let shieldImage = new Image();
            shieldImage.src = this.sprites["defend"][this.frameIndex];
            ctx.drawImage(shieldImage, this.position.x, this.position.y, this.width, this.height);
        }
        if(this.swordActive){
            let swordImage = new Image();
            swordImage.src = this.sprites["attackSword"][this.frameIndex];
            ctx.drawImage(swordImage, this.position.x, this.position.y, this.width, this.height);
        }
        if(this.magicActive){
            let magicImage = new Image();
            magicImage.src = this.sprites["attackMagic"][this.frameIndex];
            ctx.drawImage(magicImage, this.position.x, this.position.y, this.width, this.height);
        }
        if(this.bombActive){
            let bombImage = new Image();
            bombImage.src = this.sprites["leaveBomb"][this.frameIndex];
            ctx.drawImage(bombImage, this.position.x, this.position.y, this.width, this.height);
        }
        ctx.restore();
    }

    setDirection(direction) {
        if (this.sprites[direction] && direction !== this.currentDirection) {
            this.currentDirection = direction;
            this.frameIndex = 0;
            this.image.src = this.sprites[direction][this.frameIndex];        }
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
            ctx.fillRect(canvasWidth / 2 - 200, canvasHeight / 2, 400, 200);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 200, canvasHeight / 2, 400, 200);
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
            console.log("Posición del jugador:", this.player.position);
            console.log("Dimensiones del jugador:", this.player.width, this.player.height);
            console.log("Posición del viejo:", this.oldManBox.position);
            console.log("Dimensiones del viejo:", this.oldManBox.width, this.oldManBox.height);
            console.log("Colisión detectada:", boxOverlap(this.player, this.oldManBox));
            // Dibuja el hombre viejo
            ctx.drawImage(this.oldMan, this.oldManPosition.x, this.oldManPosition.y, 32, 32);
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
            } else if (this.showTutorial) {
                this.drawTutorial(ctx);
            }
            if (this.player.position.y + this.player.height >= canvasHeight &&
                this.player.position.x >= canvasWidth / 2 - 50 &&
                this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
                    alert("You have left the cave. The demo game is over.");
                    this.resetGame();
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
            ["Sal de la cueva y busca a mi companero en la tienda.", "El te dara una espada para empezar tu exploracion."]
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
                    this.player.toggleBomb(true);  
                }
            }
            if (this.mainMap && boxOverlap(this.player, this.oldManBox) && event.code === 'Space') {
                alert("You have left the cave. The demo game is over.");
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
                else if (event.key == "a") {
                    this.player.toggleBomb(false);  
                }
            }
        });

        document.getElementById("loginButton").addEventListener("click", () => {
            let username = document.getElementById("usernameInput").value;
            let password = document.getElementById("passwordInput").value;

            if (username && password) {
                document.getElementById("loginForm").style.display = "none";
                this.showLoginScreen = false;
                this.showPrologue = true;
            } else {
                alert("Por favor ingresa el usuario y contrasena valido.");
            }
        });

        document.getElementById("registerButton").addEventListener("click", () => {
            document.getElementById("loginForm").style.display = "none";
            this.showLoginScreen = false;
            this.showRegisterScreen = true;
            document.getElementById("registerForm").style.display = "block";
        });

        document.getElementById("confirmRegisterButton").addEventListener("click", () => {
            let regUsername = document.getElementById("registerUsername").value;
            let confirmRegUsername = document.getElementById("confirmRegisterUsername").value;
            let regPassword = document.getElementById("registerPassword").value;
            let confirmRegPassword = document.getElementById("confirmRegisterPassword").value;
            if (!regUsername || !confirmRegUsername || !regPassword || !confirmRegPassword) {
                alert("Por favor llena todos los campos.");
                return;
            }
            if (regUsername !== confirmRegUsername) {
                alert("Usuarios no coinciden. Intenta de nuevo.");
                return;
            }
            if (regPassword !== confirmRegPassword) {
                alert("Contrasenas no coinciden. Intenta de nuevo.");
                return;
            }
            alert("Usuario registrado exitosamente!");
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
        this.initObjects();
    }
}


// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

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
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
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