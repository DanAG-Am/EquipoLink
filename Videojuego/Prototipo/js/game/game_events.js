
/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

//event listeners, se aplican las teclas que se dibujaron en game draw y se hace su respectivo cambio en lo que se muestra en el lienzo
"use strict";

const titleScreen = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Music/title_screen.mp3");
titleScreen.loop = false;

const backgroundMusic = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Music/dungeon_theme.mp3");
backgroundMusic.loop = true;

const shopMusic = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Music/shop.mp3");
shopMusic.loop = true;

const fairyMusic = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Music/fairy.mp3");
fairyMusic.loop = true;

const bossMusic = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Music/last_boss.mp3");
bossMusic.loop = true;
const bossKilledMusic = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Music/boss_killed.mp3");
bossKilledMusic.loop = false;

const gameOver = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Music/game_over.mp3");
gameOver.loop = false;
const gameWin = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Music/game_win.mp3");
gameWin.loop = false;

const discover = new Audio("../../Videojuego/Assets/GameAssets/Sounds/World/discovery.wav");
discover.volume = sfxVolume;
function discoverSFX() {
    discover.play().catch(err => {
        console.warn("Playback failed for enter room sound:", err);
    });
}

const healing = new Audio("../../Videojuego/Assets/GameAssets/Sounds/World/healing.mp3");
healing.volume = sfxVolume;
function healSFX() {
    healing.pause();
    healing.currentTime = 0;
    healing.play().catch(err => {
        console.warn("Playback failed for healing sound:", err);
    });
}

// Variable para controlar si se ha interactuado con la página
let userHasInteracted = false;

// Detecta cualquier interacción del usuario
document.addEventListener('click', handleUserInteraction);
document.addEventListener('keydown', handleUserInteraction);

function handleUserInteraction() {
    if (!userHasInteracted) {
        userHasInteracted = true;
        console.log("Usuario ha interactuado con la página, audio habilitado.");
        
        // Intenta reproducir el audio adecuado basado en el estado actual del juego
        if (game.showMainMenu) {
            titleScreen.play().catch(err => console.warn("Error al reproducir titleScreen:", err));
        }
    }
}

function bombAttack() {
    const dropSFX = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/bomb_drop.mp3");
    dropSFX.volume = sfxVolume;
    dropSFX.play().catch(err => console.warn("Playback failed for bomb_drop:", err));

    // Después de 2 segundos, apagar el drop y reproducir la explosión
    setTimeout(() => {
        dropSFX.pause();
        dropSFX.currentTime = 0;
        bombExplode();
    }, 2000);
}
function bombExplode() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/bomb_explosion.mp3");
    sfx.volume = sfxVolume;
    sfx.play().catch(err => console.warn("Playback failed for bomb_explotion:", err));
}

function arrowShot() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/arrow_shot.wav");
    sfx.volume = sfxVolume;
    sfx.play();
}

function magicShot(){
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/magic_rod.wav");
    sfx.volume = sfxVolume;
    sfx.play();
}

function swordHit(){
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/sword_swing.wav");
    sfx.volume = sfxVolume;
    sfx.play();
}

function dashSFX() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/dash.mp3");
    sfx.volume = sfxVolume;
    sfx.currentTime = 0.1;
    sfx.play().catch(err => console.warn("Playback failed for dash:", err));
}

function shieldSFX() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Combat/shield.mp3");
    sfx.volume = sfxVolume;
    sfx.play().catch(err => console.warn("Playback failed for shield:", err));
}

titleScreen.addEventListener("ended", () => {
    if (game.showMainMenu) {
        titleScreen.currentTime = 0;
        titleScreen.play().catch(err => console.warn("Playback failed:", err));
    }
});

function updateVolumes() {
    backgroundMusic.volume = backgroundVolume;
    shopMusic.volume = backgroundVolume;
    fairyMusic.volume = backgroundVolume;
    bossMusic.volume = backgroundVolume;
    bossKilledMusic.volume = backgroundVolume;
    titleScreen.volume = backgroundVolume;
    gameOver.volume = backgroundVolume;
    gameWin.volume = backgroundVolume;
}

function stopAllMusic() {
    [titleScreen, backgroundMusic, shopMusic, fairyMusic, bossMusic, bossKilledMusic, gameWin, gameOver].forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}
function handleMusicPlayback(game) {
    // Si el usuario no ha interactuado, no intentes reproducir audio
    if (!userHasInteracted) return;

    // Si te mueres
    if (isGameOver) {
        if (!deathHandled) {
            playerStats.muertes += 1;
            updatePlayerStats(playerStats);
            deathHandled = true;
        }
    
        if (gameOver.paused) {
            stopAllMusic();
            gameOver.currentTime = 0;
            gameOver.play().catch(err => console.warn("Error al reproducir gameOver:", err));
        }
        
        drawDeathMenu(ctx); // si aquí también quieres mostrarlo
        return;
    }
    

    // Si estás en la tienda
    if (interactingMerchant) {
        if (shopMusic.paused) {
            stopAllMusic();
            shopMusic.currentTime = 0;
            shopMusic.play().catch(err => console.warn("Playback failed for shopMusic:", err));
        }
        return;
    }

    // Si estás con el hada
    if (interactingFairy) {
        if (fairyMusic.paused) {
            stopAllMusic();
            fairyMusic.currentTime = 0;
            fairyMusic.play().catch(err => console.warn("Playback failed for fairyMusic:", err));
        }
        return;
    }

    // Si estás en la batalla final
    if (game.levelBoss && !game.levelCompleted && !isGameOver) {
        if (bossMusic.paused) {
            stopAllMusic();
            bossMusic.currentTime = 0;
            bossMusic.play().catch(err => console.warn("Playback failed for bossMusic:", err));
        }
        return;
    } else if (game.levelBoss && game.levelCompleted) {
        if (bossKilledMusic.paused) {
            stopAllMusic();
            bossKilledMusic.currentTime = 0;
            bossKilledMusic.play().catch(err => console.warn("Playback failed for bossMusic:", err));
        }
        return;
    }
    
    // Si estás en el menú principal
    if (game.showMainMenu) {
        if (titleScreen.paused) {
            stopAllMusic();
            titleScreen.currentTime = 0;
            titleScreen.play().catch(err => console.warn("Playback failed for titleScreen:", err));
        }
        return;
    }

    // Si estás en el prólogo o mapa principal
    if (game.showPrologue || game.mainMap || game.level || game.level2 || game.level3 || game.restStory1 || game.restRoom1 || game.level4 || game.level5 || game.level6 || game.level7 || game.restStory2 || game.restRoom2 || game.level8 || game.level9 || game.level10 || game.restStory3 || game.restRoom3 && !isGameOver) {
        if (backgroundMusic.paused) {
            stopAllMusic();
            backgroundMusic.currentTime = 0;
            backgroundMusic.play().catch(err => console.warn("Playback failed for backgroundMusic:", err));
        }
        return;
    }

    // Si estás en la escena de Game Over
    if (isGameOver) {
        if (gameOver.paused) {
            stopAllMusic();
            gameOver.currentTime = 0;
            gameOver.play().catch(err => console.warn("Playback failed for gameOver:", err));
        }
        return;
    }

    // Si estás en la escena de finalización
    if (game.endingScene) {
        if (gameWin.paused) {
            stopAllMusic();
            gameWin.currentTime = 0;
            gameWin.play().catch(err => console.warn("Playback failed for gameWin:", err));
        }
        return;
    }
    stopAllMusic();
}

Game.prototype.createEventListeners = function(){
    window.addEventListener('keydown', (event) =>{
        if (this.showMainMenu && event.key === 'Enter') {
            this.showMainMenu = false;
            this.showPrologue = true;
            return;
        }    
        if (this.showPrologue && event.key === 'Enter') {
            this.showPrologue = false;
            this.mainMap = true;
            talkSFX();
            return;
        }
        if (this.restStory1 && event.key === 'Enter') {
            this.restStory1 = false;
            this.restRoom1 = true;
            game.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            talkSFX();
            return;
        }
        if (this.restStory2 && event.key === 'Enter') {
            this.restStory2 = false;
            this.restRoom2 = true;
            game.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            talkSFX();
            return;
        }
        if (this.restStory3 && event.key === 'Enter') {
            this.restStory3 = false;
            this.restRoom3 = true;
            game.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            talkSFX();
            return;
        }
        if (this.mainMap && this.dialogueStage < 5 && event.key === 'Enter') {
            this.dialogueStage++;
            talkSFX();
            return;
        }
        if (this.mainMap && this.dialogueStage === 5 && !this.showTutorial && !this.tutorialWasShown) {
            this.showTutorial = true;
            this.tutorialWasShown = true;
            return;
        }
        if (this.restRoom3 && this.dialogueStage2 < 8 && event.key === 'Enter') {
            this.dialogueStage2++;
            talkSFX();
            return;
        }
        if (this.levelBoss && this.dialogueStage3 < 2 && event.key === 'Enter') {
            this.dialogueStage3++;
            talkSFX();
            return;
        }
        if (this.levelBoss && this.levelCompleted && this.dialogueStage4 < 4 && event.key === 'Enter') {
            this.dialogueStage4++;
            talkSFX();
            return;
        }
        if (this.showTutorial && event.key === 't') {
            this.showTutorial = false;
            talkSFX();
            return;
        }
        if (!this.showTutorial && event.key === 't') {
            this.showTutorial = true;
            talkSFX();
            return;
        }
        if (event.key === 'i' && this.showInventory) {
            this.showInventory = false;
            talkSFX();
            return;
        }
        if (event.key === 'i' && !this.showInventory && !this.showTutorial) {
            this.showInventory = true;
            talkSFX();
            return;
        }
        if ((this.mainMap || this.level || this.level2 || this.level3 || this.restRoom1 || this.level4 || this.level5 || this.level6 || this.level7 || this.restRoom2 || this.level8 || this.level9 || this.level10 || (this.restRoom3 && this.dialogueStage2 >= 8) || (this.levelBoss && this.dialogueStage3 >= 2)) && this.dialogueStage >= 5 && !this.showTutorial && !isGameOver && !this.showLevelCompleteMessage) {
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
                this.player.toggleShield(true);
            }
            else if(event.key=="z"){
                swordHit();
                this.player.toggleSword(true);
            }
            else if(event.key=="c"){
                const now = Date.now();
                if (now - this.lastMagicTime < 500) return; // cooldown de 0.5s
                this.lastMagicTime = now;

                if (playerStats.mana > 0) {
                    magicShot();
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
                const now = Date.now();
                if (now - this.lastArrowTime < 500) return; // cooldown de 0.5s
                this.lastArrowTime = now;

                if (playerStats.arrows > 0) {
                    arrowShot();
                    playerStats.arrows--;
                    playerStats.objetos_usados++; 
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
            } else if (event.key == "a") {
                const now = Date.now();
                if (now - this.lastBombTime < 2000) return; // Cooldown de 2 segundos para dejar bomba
                
                if (playerStats.bombs > 0) {
                    this.lastBombTime = now;
                    bombAttack();
                    playerStats.bombs--;
                    playerStats.objetos_usados++; 
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
            } else if (event.key === "f") {
                const now = Date.now();
                if (now - this.lastDashTime < this.dashCooldown) return;
                this.lastDashTime = now;
                dashSFX();

                let dashOffset = new Vec(0, 0);
                if (this.player.currentDirection === "up") dashOffset = new Vec(0, -this.dashDistance);
                if (this.player.currentDirection === "down") dashOffset = new Vec(0, this.dashDistance);
                if (this.player.currentDirection === "left") dashOffset = new Vec(-this.dashDistance, 0);
                if (this.player.currentDirection === "right") dashOffset = new Vec(this.dashDistance, 0);
            
                const futurePosition = this.player.position.plus(dashOffset);
                const futureBox = {
                    position: futurePosition,
                    width: this.player.width,
                    height: this.player.height
                };
            
                const collidesWithWall = getWallBoxes().some(wall => boxOverlap(futureBox, wall));
            
                const npcs = [];
                if (game.mainMap || game.restRoom1 || game.restRoom2 || game.restRoom3) {
                    npcs.push(this.tienda);
                    npcs.push(this.fairy);
                }
                if (game.mainMap || game.restRoom3) {
                    npcs.push(this.oldMan);
                }

                const collidesWithNPC = npcs.some(npc => {
                    if (!npc) return false; // proteger si algún NPC no existe
                    return boxOverlap(futureBox, {
                        position: npc.position,
                        width: npc.width,
                        height: npc.height
                    });
                });
                if (!collidesWithWall && !collidesWithNPC) {
                    this.player.position = futurePosition;
                }
            } else if (event.key === "Shift") {
                this.player.toggleShield(true); // activar visualmente
            }
        }
        if (event.key == "o") {
            if ((this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10) && this.levelCompleted) {
                const px = this.player.position.x;
                const py = this.player.position.y;
                const cx = this.levelChestPosition.x;
                const cy = this.levelChestPosition.y;
        
                const nearLevelChest = px > cx - 36 && px < cx + 36 && py > cy - 36 && py < cy + 36;
        
                if (nearLevelChest && !this.chestHasBeenOpened) {
                    discoverSFX();
                    this.chestIsOpen = true;
        
                    let item = Math.random();
                    if (item <= 0.33) {
                        const amount = Math.floor(Math.random() * 2) + 1;
                        playerStats.bombs += amount;
                        this.chestReward = { type: "bombs", amount };
                    } else if (item <= 0.66) {
                        const amount = Math.floor(Math.random() * 3) + 3;
                        playerStats.arrows += amount;
                        this.chestReward = { type: "arrows", amount };
                    } else {
                        const amount = Math.floor(Math.random() * 2) + 1;
                        playerStats.potions += amount;
                        this.chestReward = { type: "potions", amount };
                    }
        
                    this.chestHasBeenOpened = true;
                    this.chestRewardActive = true;
                }
            }
        }
        if (game.chestRewardActive && event.key === "Enter") {
            game.chestRewardActive = false;
            game.chestReward = null;
        }
        if (event.key == "d") {
            if (playerStats.potions > 0 && playerStats.life < playerStats.maxLife){
                playerStats.potions--;
                playerStats.objetos_usados++; 
                healSFX();
                let lifeRegen = Math.floor(Math.random() * 20) + 10;
                playerStats.life = Math.min(playerStats.life + lifeRegen, playerStats.maxLife);
            }
        }
        if (event.key === "Escape") {
            gamePaused = !gamePaused;
            talkSFX();
            if (gamePaused) {
                game.stopTimer();
            } else {
                game.startTimer();
            }
        }
        if (event.key === " "){ //detectar una colision antes de permiter usar space para interactuar con npc
            if (this.mainMap || this.restRoom1 || this.restRoom2 || this.restRoom3) {
                talkSFX();
                if (
                    document.getElementById("purchaseDialog").style.display !== "none" ||
                    document.getElementById("errorDialog").style.display !== "none" ||
                    document.getElementById("loginForm").style.display !== "none" ||
                    document.getElementById("registerForm").style.display !== "none"
                ) {
                    return; 
                }
                const playerNearNPC = this.player.position.x > this.oldMan.position.x - 36 &&
                    this.player.position.x < this.oldMan.position.x + 36 &&
                    this.player.position.y > this.oldMan.position.y - 36 &&
                    this.player.position.y < this.oldMan.position.y + 36;
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
                const playerNearFairy = this.player.position.x > game.fairy.position.x - 36 &&
                                        this.player.position.x < game.fairy.position.x + 36 &&
                                        this.player.position.y > game.fairy.position.y - 36 &&
                                        this.player.position.y < game.fairy.position.y + 36;
                if (playerNearFairy) {
                    interactingFairy = !interactingFairy;
                }
            }
        }
        if (this.showLevelCompleteMessage && event.key === "Enter") {
            this.showLevelCompleteMessage = false;
            this.unlockNextLevel();
        }
        if (game.endingScene && game.playerReachedCenter && event.key === "Enter") {
            if (game.endingDialogueStage < 2) {
                game.endingDialogueStage++;
                talkSFX();
            } else if (!game.showEndingLogo) {
                game.showEndingLogo = true;
            } else {
                gameWasCompleted = true;
                game.endingScene = false;
                game.restartGame();
            }
        }
    });

    window.addEventListener('keyup', (event) => { //quitar las armas si no se estan utilizando (no presiona la tecla)
        if ((this.mainMap || this.level || this.level2 || this.level3 || this.restRoom1 || this.level4 || this.level5 || this.level6 || this.level7 || this.restRoom2 || this.level8 || this.level9 || this.level10 || this.restRoom3 || this.levelBoss) && !this.showTutorial) {
            if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
                this.player.velocity.y = 0;
            } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                this.player.velocity.x = 0;
            } else if (event.key == "Shift") {
                this.player.toggleShield(false);
            } else if(event.key=="z"){
                this.player.toggleSword(false);
            } else if(event.key=="c"){
                this.player.toggleMagic(false);
            } else if(event.key == "x"){
                this.player.toggleBow(false);
            }
            if (event.key === "Shift") {
                this.player.toggleShield(false); // desactivar cuando sueltas
            }
        }
    });

    window.addEventListener('mousedown', (event) =>{
        if (showSoundOptions && game.sliderBounds) {
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
        
            const checkSlider = (name, volumeRef) => {
                const bounds = game.sliderBounds[name];
                if (
                    clickX >= bounds.x && clickX <= bounds.x + bounds.width &&
                    clickY >= bounds.y - 5 && clickY <= bounds.y + bounds.height + 5
                ) {
                    draggingSlider = name;
                    const newVal = (clickX - bounds.x) / bounds.width;
                    if (name === "bg") backgroundVolume = Math.max(0, Math.min(1, newVal));
                    else if (name === "sfx") sfxVolume = Math.max(0, Math.min(1, newVal));
                    updateVolumes();
                }
            };
            checkSlider("bg");
            checkSlider("sfx");
        }
    });
    window.addEventListener("mousemove", (event) => {
        if (!draggingSlider || !game.sliderBounds) return;
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let clickX = (event.clientX - rect.left) * scaleX;
    
        const bounds = game.sliderBounds[draggingSlider];
        const newVal = (clickX - bounds.x) / bounds.width;
        if (draggingSlider === "bg") {
            backgroundVolume = Math.max(0, Math.min(1, newVal));
        } else if (draggingSlider === "sfx") {
            sfxVolume = Math.max(0, Math.min(1, newVal));
        }
        updateVolumes();
    });
    window.addEventListener("mouseup", () => {
        draggingSlider = null;
    });

    let currentItemType = "";
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('click', (event) => { //dibujar la tienda si interactua con el vendedor
        if (interactingMerchant && game.tienda.dialogueStage === 0 && game.tienda.buttonPositions) {
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
            let btn1 = game.tienda.buttonPositions.button1;
            let btn2 = game.tienda.buttonPositions.button2;
            let btn3 = game.tienda.buttonPositions.button3;
            let btn4 = game.tienda.buttonPositions.button4;
            let btn5 = game.tienda.buttonPositions.button5;
            if (clickX >= btn1.x && clickX <= btn1.x + btn1.width &&
                clickY >= btn1.y && clickY <= btn1.y + btn1.height) {
                currentItemType = "pociones";
                talkSFX();
                showPurchaseDialog(currentItemType);
            } else if (clickX >= btn2.x && clickX <= btn2.x + btn2.width &&
                       clickY >= btn2.y && clickY <= btn2.y + btn2.height) {
                currentItemType = "flechas";
                talkSFX();
                showPurchaseDialog(currentItemType);
            } else if (clickX >= btn3.x && clickX <= btn3.x + btn3.width &&
                       clickY >= btn3.y && clickY <= btn3.y + btn3.height) {
                currentItemType = "bombas";
                talkSFX();
                showPurchaseDialog(currentItemType);
            } else if (clickX >= btn4.x && clickX <= btn4.x + btn4.width &&
                clickY >= btn4.y && clickY <= btn4.y + btn4.height) {
                if (playerStats.rupees >= 30) {
                    playerStats.rupees -= 30;
                    playerStats.maxLife = (playerStats.maxLife || 100) + 10;
                    playerStats.life = Math.min(playerStats.life + 10, playerStats.maxLife);
                    talkSFX();
                } else {
                    let errorDialog = document.getElementById("errorDialog");
                    let errorMessage = document.getElementById("errorMessage");
                    errorMessage.innerText = "No tienes suficientes rupias para esta compra.";
                    errorDialog.style.display = "block";
                    document.getElementById("purchaseDialog").style.display = "none";
                    interactingMerchant = false;
                    game.tienda.dialogueStage = 0;
                }
            } else if (clickX >= btn5.x && clickX <= btn5.x + btn5.width &&
                clickY >= btn5.y && clickY <= btn5.y + btn5.height) {
                if (playerStats.rupees >= 30) {
                    playerStats.rupees -= 30;
                    playerStats.maxMana = (playerStats.maxMana || 100) + 10;
                    playerStats.mana = Math.min(playerStats.mana + 10, playerStats.maxMana);
                    talkSFX();
                } else {
                    let errorDialog = document.getElementById("errorDialog");
                    let errorMessage = document.getElementById("errorMessage");
                    errorMessage.innerText = "No tienes suficientes rupias para esta compra.";
                    errorDialog.style.display = "block";
                    document.getElementById("purchaseDialog").style.display = "none";
                    interactingMerchant = false;
                    game.tienda.dialogueStage = 0;
                }
            }
        }
        if (gamePaused && game.pauseButton) { //logica de pausar juego
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
        
            const { options, return: returnBtn } = game.pauseButton;
            if (
                clickX >= returnBtn.x && clickX <= returnBtn.x + returnBtn.width &&
                clickY >= returnBtn.y && clickY <= returnBtn.y + returnBtn.height
            ) {
                talkSFX();
                gamePaused = false;
                game.resetGame(true);
            }
            if (
                clickX >= options.x && clickX <= options.x + options.width &&
                clickY >= options.y && clickY <= options.y + options.height
            ) {
                talkSFX();
                showSoundOptions = true;
            }
        }
        if (showSoundOptions && game.soundOptionsButton) {
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
        
            let btn = game.soundOptionsButton;
            if (
                clickX >= btn.x && clickX <= btn.x + btn.width &&
                clickY >= btn.y && clickY <= btn.y + btn.height
            ) {
                talkSFX();
                showSoundOptions = false;
            }
        }
        if (isGameOver && game.gameOverButton) { //logica de perder
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
        
            let btn = game.gameOverButton;
            if (
                clickX >= btn.x && clickX <= btn.x + btn.width &&
                clickY >= btn.y && clickY <= btn.y + btn.height
            ) {
                talkSFX();
                isGameOver = false;
                game.resetGame();
            }
        }
        if (interactingFairy && game.fairy.button) { //si interactua con el hada, puede recibir un bonus (jugador o enemigo)
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
            let btn = game.fairy.button;
            if (clickX >= btn.x && clickX <= btn.x + btn.width &&
                clickY >= btn.y && clickY <= btn.y + btn.height) {
                talkSFX();
                game.fairy.processInteraction();
                interactingFairy = false;
            }
        }
    });

    document.getElementById("purchaseButton").addEventListener("click", () => { //boton de compra
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
        let totalCost = price * qty; //calculo sobre las rupias que tiene el jugador y sus stats
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
        talkSFX();
        document.getElementById("purchaseDialog").style.display = "none";
    });

    document.getElementById("cancelButton").addEventListener("click", () => {
        talkSFX();
        document.getElementById("purchaseDialog").style.display = "none";
    });

    document.getElementById("errorOkButton").addEventListener("click", () => {
        talkSFX();
        document.getElementById("errorDialog").style.display = "none";
    });

    document.getElementById("purchaseQuantity").addEventListener("input", function() {
        let value = parseInt(this.value);
        talkSFX();
        if (value < 1) {
            this.value = 1;
        } else if (value > 20) {
            this.value = 20;
        }
    });
};