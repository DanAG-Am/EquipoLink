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
const bottomBar1 = new GameObject(new Vec(0, canvasHeight - 20), canvasWidth / 2 - 50, 20, "black", "obstacle");
const bottomBar2 = new GameObject(new Vec(canvasWidth / 2 + 50, canvasHeight - 20), canvasWidth / 2 - 50, 20, "black", "obstacle");

class Player extends GameObject{
    constructor(position, width, height, color){
        super(position, width, height, color, "player");
        this.velocity = new Vec(0, 0);
        this.sprites ={
            "down": "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_1.png",
            "right": "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_3.png",
            "left": "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_3.png", // Se invertirá en el dibujo
            "up": "../Videojuego/Assets/GameAssets/Basic_Movements/Basic_movement_5.png"
        };
        this.currentSprite = this.sprites["up"];
        this.facingLeft = false;
        this.image = new Image();
        this.image.src = this.currentSprite;
    }

    update(deltaTime){
        this.position = this.position.plus(this.velocity.times(deltaTime));

        // Limitar el movimiento dentro del canvas
        this.position.x = Math.max(0, Math.min(canvasWidth - this.width, this.position.x));
        this.position.y = Math.max(0, Math.min(canvasHeight - this.height, this.position.y));
    }

    draw(ctx){
        ctx.save();
        if (this.facingLeft){
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -this.position.x - this.width, this.position.y, this.width, this.height);
        } else {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        ctx.restore();
    }

    setSprite(spriteKey) {
        this.currentSprite = this.sprites[spriteKey];
        this.image.src = this.currentSprite;
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
        this.logo = new Image();
        this.logo.src = "../Videojuego/Assets/MDAssets/Three.png";
        this.oldMan = new Image();
        this.oldMan.src = "../Videojuego/Assets/GameAssets/NPC/Old_man.png";
    }

    initObjects() {
        this.player = new Player(new Vec(canvasWidth / 2 - 14, 405), 32, 32);
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
            ctx.fillText("Press Enter to start the game", canvasWidth / 2, 570);
        } else if (this.showLoginScreen){
            // Dibujar el logo
            ctx.drawImage(this.logo, canvasWidth / 2 - 228, 80, 450, 450);
            // Dibujar el cuadro del login
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 200, canvasHeight / 2 - 100, 400, 200);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 200, canvasHeight / 2 - 100, 400, 200);
            // Dibujar el formulario
            document.getElementById("loginForm").style.display = "block";
            document.getElementById("registerForm").style.display = "none";
        } else if (this.showRegisterScreen){
            // Dibujar el logo
            ctx.drawImage(this.logo, canvasWidth / 2 - 228, 80, 450, 450);
            // Dibujar al jugador debajo del logo
            this.player.draw(ctx);
            // Dibujar el cuadro del register
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 200, canvasHeight / 2 - 100, 400, 200);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 200, canvasHeight / 2 - 100, 400, 200);
            // Dibujar el formulario
            document.getElementById("registerForm").style.display = "block";
            document.getElementById("loginForm").style.display = "none";
        } else if (this.showPrologue){
            ctx.fillStyle = "white";
            ctx.font = "60px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Prologo", canvasWidth / 2, 85);
            // Dibujar el cuadro del prólogo
            ctx.fillStyle = "black";
            ctx.fillRect(canvasWidth / 2 - 340, canvasHeight / 2 - 180, canvasWidth / 4 + 480, canvasHeight / 2 + 70);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(canvasWidth / 2 - 340, canvasHeight / 2 - 180, canvasWidth / 4 + 480, canvasHeight / 2 + 70);
            // Dibujar el texto del prólogo
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
            let yPosition = canvasHeight / 4 + 60;
            prologueText.forEach(line => {
                ctx.fillText(line, canvasWidth / 2, yPosition);
                yPosition += 50;
            });
            // Mensaje para continuar
            ctx.font = "20px Arial";
            ctx.fillText("Press Enter to continue", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
        } else if (this.mainMap){
            // Dibuja el hombre viejo
            ctx.drawImage(this.oldMan, canvasWidth / 2 - 14, 200, 32, 32);
            // Dibuja el jugador
            this.player.draw(ctx);
            // Dibuja la puerta
            bottomBar1.draw(ctx);
            bottomBar2.draw(ctx);
            if (this.dialogueStage < 5) {
                this.drawDialogue(ctx);
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
            if (this.mainMap && this.dialogueStage >= 5) {
                if (event.key == 'ArrowUp'){
                    this.player.velocity.y = -playerSpeed;
                    this.player.setSprite("up");
                } else if (event.key == 'ArrowLeft'){
                    this.player.velocity.x = -playerSpeed;
                    this.player.setSprite("left");
                    this.player.facingLeft = true;
                } else if (event.key == 'ArrowDown'){
                    this.player.velocity.y = playerSpeed;
                    this.player.setSprite("down");
                } else if (event.key == 'ArrowRight'){
                    this.player.velocity.x = playerSpeed;
                    this.player.setSprite("right");
                    this.player.facingLeft = false;
                }
            }
        });

        window.addEventListener('keyup', (event) =>{
            if (this.mainMap && this.dialogueStage >= 5) {
                if (event.key == 'ArrowUp' || event.key == 'ArrowDown'){
                    this.player.velocity.y = 0;
                } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight'){
                    this.player.velocity.x = 0;
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
                alert("Please enter a username and password.");
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
                alert("Please fill in all fields.");
                return;
            }
            if (regUsername !== confirmRegUsername) {
                alert("Usernames do not match. Please try again.");
                return;
            }
            if (regPassword !== confirmRegPassword) {
                alert("Passwords do not match. Please try again.");
                return;
            }
            alert("Registration successful!");
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