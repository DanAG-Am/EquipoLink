/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

"use strict";

//fetch de audios
const enterRoomAudio = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/Character/enter_room.wav");
enterRoomAudio.volume = 1;
function playEnterRoomSFX() {
    enterRoomAudio.play().catch(err => {
        console.warn("Playback failed for enter room sound:", err);
    });
}

const talkAudio = new Audio("/Videojuego/Videojuego/Assets/GameAssets/Sounds/interact/talk_or_meterup_sound.wav");
talkAudio.volume = 1;
function talkSFX() {
    talkAudio.pause();
    talkAudio.currentTime = 0;
    talkAudio.play().catch(err => {
        console.warn("Playback failed for talkSFX:", err);
    });
}

// Dibuja el estado actual del juego
Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    handleMusicPlayback(this);
    
    if (this.showMainMenu) {
        // Dibuja el video como fondo (si ya está cargado)
        if (this.titleVideo && this.titleVideo.readyState >= 2) {
            ctx.drawImage(this.titleVideo, 0, 0, canvasWidth, canvasHeight);
        }
        // Cuadro negro para tapar el texto original del video
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(canvasWidth / 2 - 200, 530, 400, 52);

        // Texto personalizado en español
        ctx.fillStyle = "white";
        ctx.font = "15px Game";
        ctx.textAlign = "center";
        ctx.fillText("Presiona Enter para jugar", canvasWidth / 2, 562);
    } else if (this.showPrologue){
        drawBackground("prologue", ctx);
        playerStats.level = "Cave";
        playerStats.uiTextPosition = { x: 70, y: 30 };
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.fillStyle = "white";
        ctx.font = "30px Game";
        ctx.textAlign = "center";
        ctx.fillText("Prologo", canvasWidth / 2, 170);
        ctx.fillStyle = "white";
        ctx.font = "11.5px Game";
        ctx.textAlign = "center";
        const prologueText = [
            "La oscuridad se disipa.", "Sentinel despierta en un frio suelo de piedra,",
            "con el eco de gotas cayendo a su alrededor.",
            "La tenue luz de una antorcha ilumina la cueva.",
            "Se siente debil, sin recuerdos de como llego alli.",
            "Un anciano se le acerca y empieza a hablar."
        ];
        let yPosition = canvasHeight / 4 + 95;
        prologueText.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 40;
        });
        ctx.font = "15px Game";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
    } else if (this.mainMap){ 
        //dibujar main map
        drawBackground("mainMap", ctx);
        // Dibujar NPCs (Old Man, Merchant y Fairy)
        this.oldMan.draw(ctx);
        this.tienda.draw(ctx);
        this.fairy.draw(ctx);
        this.player.draw(ctx);

        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.player.draw(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.dialogueStage < 5) {
            this.drawDialogue(ctx);
            ctx.font = "10px Game";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 190, 600, 100);
        } else if (this.dialogueStage === 5 && !this.tutorialWasShown) {
            this.showTutorial = true;
            this.tutorialWasShown = true;
            playerStats.bombs = 10;
            playerStats.arrows = 20;
            playerStats.rupees = 50;
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        if (this.player.position.y <= 0 &&
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
                playEnterRoomSFX();
                this.mainMap = false;
                this.level = true;
                this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
                playerStats.level = 1;
                playerStats.uiTextPosition = { x: 90, y: 30 };
                rupeesInitialized = false;
                this.levelEnemyInterval = setInterval(() => {this.spawnEnemies();}, 5000);
        }
        if (this.showInventory) {
            this.drawInventory(ctx);
        }
        
    } else if (this.level){ //dibujar el primer nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("levelClosed", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        if (this.player.position.y <= 0 && //transicion entre nivel 1 y 2, se repite la misma estructura en el resto de los niveles
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level = false;
            this.level2 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level2) { //dibujar el segundo nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_2", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.bombs.forEach(b => b.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
    
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level2 = false;
            this.level3 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } 
    else if (this.level3) { //dibujar nivel 3
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_3", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        this.bombs.forEach(b => b.draw(ctx));
    
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        if (this.player.position.y <= 0 && //transicion entre nivel 3 y cuarto de descanso y mejoras
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level3 = false;
            this.restStory1 = true;
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestHasBeenOpened = false;
            this.chestIsOpen = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level = "Rest";
            playerStats.uiTextPosition = { x: 70, y: 30 };
            game.player.velocity = new Vec(0, 0);
        }
    } else if (this.restStory1){ //se le proporciona una parte de la historia al jugador
        drawBackground("prologue", ctx);
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.fillStyle = "white";
        ctx.font = "30px Game";
        ctx.textAlign = "center";
        ctx.fillText("Historia 1", canvasWidth / 2, 185);
        ctx.fillStyle = "white";
        ctx.font = "11.5px Game";
        ctx.textAlign = "center";
        const prologueText = [
            "En una cámara oscura, Sentinel", "descubre una antigua inscripción en",
            "la pared cubierta de musgo."," Al tocarla, un dolor agudo le atraviesa",
            "la cabeza. Un recuerdo emerge:"," Gritos. Llamas devorando su aldea.",
            "Una sombra oscura, con ojos carmesí,"," blandiendo una espada negra.",
            "Sentinel, de rodillas, herido."," Una voz femenina susurra en su oído:",
            "'Corre… eres nuestra última esperanza.'"
        ];
        let yPosition = canvasHeight / 4 + 95;
        prologueText.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 20;
        });
        ctx.font = "15px Game";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
    } else if (this.restRoom1){ //dibujar el cuarto de descanso
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("mainMap", ctx);
        // Dibujar NPCs (Merchant y Fairy)
        this.tienda.draw(ctx);
        this.fairy.draw(ctx); 
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        if (this.showInventory) {
            this.drawInventory(ctx);
        }
        if (this.player.position.y <= 0 && //transicion entre nivel 3 y cuarto de descanso y mejoras
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.restRoom1 = false;
            this.level4 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            rupeesInitialized = false;
            playerStats.level = 4;
            playerStats.uiTextPosition = { x: 90, y: 30 };
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level4){ //dibujar nivel 4
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_4", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && 
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level4 = false;
            this.level5 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level5) { //dibujar el quinto nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_5", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
    
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level5 = false;
            this.level6 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level6) { //dibujar el sexto nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_6", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
    
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level6 = false;
            this.level7 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level7) { //dibujar el septimo nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_7", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
    
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level7 = false;
            this.restStory2 = true;
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestHasBeenOpened = false;
            this.chestIsOpen = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level = "Rest";
            playerStats.uiTextPosition = { x: 70, y: 40 };
            game.player.velocity = new Vec(0, 0);
        }
    } else if (this.restStory2){ //se le proporciona una parte de la historia al jugador
        drawBackground("prologue", ctx);
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.fillStyle = "white";
        ctx.font = "30px Game";
        ctx.textAlign = "center";
        ctx.fillText("Historia 2", canvasWidth / 2, 185);
        ctx.fillStyle = "white";
        ctx.font = "12px Game";
        ctx.textAlign = "center";
        const prologueText = [
            "Un guardián espectral bloquea su paso. Con",
            "una voz que retumba como trueno entre ruinas,",
            "declara: 'Tú… y el Rey Aquamentus… son hermanos'",
            "Sentinel se congela. El aire se vuelve denso. Las",
            "piezas comienzan a encajar. El espectro desvanece",
            "tras el mensaje. Sentinel cae de rodillas,",
            "sus manos temblando. Seltinel sigue su camino."
        ];
        let yPosition = canvasHeight / 4 + 85;
        prologueText.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 30;
        });
        ctx.font = "15px Game";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
    } else if (this.restRoom2){ //dibujar el cuarto de descanso 2
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("mainMap", ctx);
        // Dibujar NPCs (Merchant y Fairy)
        this.tienda.draw(ctx);
        this.fairy.draw(ctx); 
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        if (this.showInventory) {
            this.drawInventory(ctx);
        }
        if (this.player.position.y <= 0 && //transicion entre nivel 3 y cuarto de descanso y mejoras
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.restRoom2 = false;
            this.level8 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            rupeesInitialized = false;
            playerStats.level = 8;
            playerStats.uiTextPosition = { x: 90, y: 30 };
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level8){ //dibujar nivel 8
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_8", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level8 = false;
            this.level9 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level9){ //dibujar nivel 9
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_9", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level9 = false;
            this.level10 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestIsOpen = false;
            this.chestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            playerStats.uiTextPosition = { x: 85, y: 30 };
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level10){ //dibujar nivel 10
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_10", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        this.drawEnemyHealthBars(ctx);
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        drawChestReward(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.player.position.y <= 0 && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.level10 = false;
            this.restStory3 = true;
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.chestHasBeenOpened = false;
            this.chestIsOpen = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level = "Rest";
            playerStats.uiTextPosition = { x: 70, y: 30 };
            game.player.velocity = new Vec(0, 0);
        }
    } else if (this.restStory3){ //se le proporciona una parte de la historia al jugador
        drawBackground("prologue", ctx);
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.fillStyle = "white";
        ctx.font = "30px Game";
        ctx.textAlign = "center";
        ctx.fillText("Historia 3", canvasWidth / 2, 185);
        ctx.fillStyle = "white";
        ctx.font = "14px Game";
        ctx.textAlign = "center";
        const prologueText = [
            "En el corazón de un templo olvidado,", "Sentinel halla una espada negra",
            "clavada en un altar de obsidiana.","La toca, y una visión brutal lo invade:",
            "'Su hermano, con el rostro cubierto de", "lágrimas y sangre,",
            "Acepta un pacto prohibido para salvar a",
            "su gente. Su alma se corrompe, su poder","se multiplica. El Rey Aquamentus nace.'",
            "Sentinel cae al suelo, convulsionando."
        ];
        let yPosition = canvasHeight / 4 + 90;
        prologueText.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 20;
        });
        ctx.font = "15px Game";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
    } else if (this.restRoom3){ //dibujar el cuarto de descanso 3
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("mainMap", ctx);
        // Dibujar NPCs (Old Man, Merchant y Fairy)
        this.oldMan.draw(ctx);
        this.tienda.draw(ctx);
        this.fairy.draw(ctx); 
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        if (this.dialogueStage2 < 8) {
            this.drawDialogue2(ctx);
            ctx.font = "10px Game";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 190, 600, 100);
        }
        if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        if (this.showInventory) {
            this.drawInventory(ctx);
        }
        if (this.player.position.y <= 0 && //transicion entre nivel 3 y cuarto de descanso y mejoras
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.restRoom3 = false;
            this.levelBoss = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 2);
            rupeesInitialized = false;
            playerStats.level = "Final";
            playerStats.uiTextPosition = { x: 70, y: 30 };
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.levelBoss) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("prologue", ctx);
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        if (this.dialogueStage3 < 2) {
            this.drawDialogue3(ctx);
            ctx.font = "10px Game";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 190, 600, 100);
        } else {
            this.drawEnemies(ctx);
            this.drawEnemyHealthBars(ctx);
        }
        this.player.draw(ctx);
        this.bombs.forEach(b => b.draw(ctx));
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }
        if (this.levelCompleted && this.dialogueStage4 < 4) {
            this.drawDialogue4(ctx);
            ctx.font = "10px Game";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 190, 600, 100);
        } 
        if (this.levelCompleted &&
            this.player.position.y <= 0 &&
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            playEnterRoomSFX();
            this.levelBoss = false;
            this.endingScene = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 1.5);
            rupeesInitialized = false;
            playerStats.level = "Outside";
            playerStats.uiTextPosition = { x: 58, y: 30 };
        }
    } else if (this.endingScene) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("ending", ctx);
    
        // Movimiento hacia el centro
        const centerY = canvasHeight / 2 - this.player.height / 2;
        if (!this.playerReachedCenter) {
            if (this.player.position.y > centerY) {
                this.player.position.y -= 0.5; // se mueve hacia arriba lentamente
            } else {
                this.playerReachedCenter = true;
                this.player.currentDirection = "up"; // mira hacia abajo al llegar
                this.player.frameIndex = 0;
                this.player.image.src = this.player.sprites["win"];
                this.player.velocity = new Vec(0, 0);
            }
        }
    
        this.player.draw(ctx);
    
        // Mostrar diálogos
        if (this.playerReachedCenter && this.endingDialogueStage < 3 && !this.showEndingLogo) {
            this.drawEndingDialogue(ctx);
            ctx.font = "10px Game";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 190);
        }
    
        // Mostrar logo final
        if (this.showEndingLogo) {
            ctx.drawImage(this.logo, canvasWidth / 2 - 200, canvasHeight / 2 - 180, 400, 400);
            ctx.font = "25px Game";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Thank you for playing!!", canvasWidth / 2, 450);
            ctx.font = "15px Game";
            ctx.fillText("Presiona Enter para regresar al menú principal", canvasWidth / 2, 500);
        }
    } else {
        this.actors.forEach(actor => actor.draw(ctx));
        this.player.draw(ctx);
    }
    if (gamePaused) {
        drawPauseMenu(ctx);
    }
    if (interactingNPC) {
        drawNPCTutorial(ctx);
    }
    if (interactingMerchant) {
        this.tienda.drawDialogue(ctx);
    }
    if (interactingFairy) {
        this.fairy.drawDialogue(ctx);
    }
    if (this.showLevelCompleteMessage) {
        drawCompleteMessage(ctx);
    }
    if (isGameOver) {
        drawDeathMenu(ctx);
    }

    // ───── INICIAR si acaba de entrar al prólogo ─────
    if (this.showPrologue && !this._wasInPrologue) this.startTimer();
    this._wasInPrologue = this.showPrologue;
    // ───── DETENER si acaba de morir ─────
    const isDead = this.player.hp <= 0;
    if (isDead && !this._wasDead) this.stopTimer();
    this._wasDead = isDead;
    // ───── DETENER si acaba de entrar a endingScene ─────
    if (this.endingScene && this.showEndingLogo && !this._wasInEnding) this.stopTimer();
    this._wasInEnding = this.endingScene && this.showEndingLogo;
    // ───── DETENER si acaba de pausar ─────
    if (this.gamePaused && this.isTimerRunning) this.stopTimer();
    // ───── REANUDAR si acaba de quitar la pausa ─────
    if (!this.gamePaused && this._wasPaused && !this.endingScene && !isDead && this.showPrologue) this.startTimer();
    this._wasPaused = this.paused;
};

Game.prototype.drawDialogue = function(ctx) { //dibujar dialogos del viejo
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.fillStyle = "white";
    ctx.font = "12px Game";
    ctx.textAlign = "center";
    let dialogueTexts = [
        ["Por fin has despertado, joven heroe!"],
        ["Tu hermano ha sido capturado", "por el Ejercito de la Oscuridad!"],
        ["Ha sido llevado a su fortaleza", "en los ultimos cuartos de esta mazmorra,", "donde su lider..."],
        ["El Rey Aquamentus!"],
        ["Te doy unas armas para empezar tu exploracion.", "Intenta visitar a la tienda", "para mejorar tus habilidades."]
    ];
    let lines = dialogueTexts[this.dialogueStage];
    let yPosition = 100;
    lines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, yPosition);
        yPosition += 25;
    });
};

Game.prototype.drawDialogue2 = function(ctx) { //dibujar dialogos 2 del viejo
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.fillStyle = "white";
    ctx.font = "14px Game";
    ctx.textAlign = "center";
    let dialogueTexts = [
        ["¡Por fin has llegado hasta aquí,", "joven héroe!"],
        ["Has superado pruebas que pocos", "podrían enfrentar."],
        ["Más allá de esta sala...", "vive el temido Rey Aquamentus."],
        ["Él es quien corrompió a tu hermano", "con la Oscuridad."],
        ["Este es tu destino. Tu momento."],
        ["No puedo acompañarte,", "pero tienes mi bendición."],
        ["Ten cuidado... y buena suerte."],
        ["¡Salva a tu hermano y trae", "la luz de vuelta a este mundo!"]
    ];
    let lines = dialogueTexts[this.dialogueStage2];
    let yPosition = 110;
    lines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, yPosition);
        yPosition += 25;
    });
};

Game.prototype.drawDialogue3 = function(ctx) { //dibujar dialogos del jefe final
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.fillStyle = "white";
    ctx.font = "14px Game";
    ctx.textAlign = "center";
    let dialogueTexts = [
        ["¡GRAAAAAAAAAAAAAAHHH!"],
        ["¡Te destruiré, insignificante humano!"]
    ];
    let lines = dialogueTexts[this.dialogueStage3];
    let yPosition = 125;
    lines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, yPosition);
        yPosition += 25;
    });
};

Game.prototype.drawDialogue4 = function(ctx) { //dibujar dialogos del jefe final
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.fillStyle = "white";
    ctx.font = "15px Game";
    ctx.textAlign = "center";
    let dialogueTexts = [
        ["¡GRAAAAAAAAAAAAAAHHH!"],
        ["¡Has derrotado al jefe", "y salvado a tu hermano!"],
        ["¡La luz te espera", "fuera de esta mazmorra!"],
        ["¡Ve y cumple tu destino!"]
    ];
    let lines = dialogueTexts[this.dialogueStage4];
    let yPosition = 110;
    lines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, yPosition);
        yPosition += 25;
    });
};

Game.prototype.drawEndingDialogue = function(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 70, 600, 100);
    ctx.fillStyle = "white";
    ctx.font = "14px Game";
    ctx.textAlign = "center";
    const texts = [
        ["Por fin he logrado completar la mazmorra."],
        ["Ya vamos a volver a nuestra casa."],
        ["Un buen hecho, hermano."],
    ];
    const lines = texts[this.endingDialogueStage];
    let y = 125;
    lines.forEach(line => {
        ctx.fillText(line, canvasWidth / 2, y);
        y += 25;
    });
};

Game.prototype.drawTutorial = function(ctx) { //dibujar el turorial
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 100, 600, 400);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 100, 600, 400);
    ctx.fillStyle = "white";
    ctx.font = "25px Game";
    ctx.textAlign = "center";
    const imgWidth = 560;
    const imgHeight = 360;
    const imgX = canvasWidth / 2 - imgWidth / 2;
    const imgY = 120;
    ctx.drawImage(tutorialImg, imgX, imgY, imgWidth, imgHeight);
    ctx.font = "15px Game";
    ctx.fillText("Presiona T para continuar", canvasWidth / 2, 530);
};

Game.prototype.drawInventory = function(ctx) { //dibujar inventario
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.9;
    ctx.fillRect(canvasWidth / 2 - 150, canvasHeight / 2 + 80, 300, 180);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 150, canvasHeight / 2 + 80, 300, 180);
    ctx.fillStyle = "white";
    ctx.font = "15px Game";
    ctx.textAlign = "center";
    ctx.fillText("Inventario", canvasWidth / 2, canvasHeight / 2 + 110);
    ctx.drawImage(arrowImg, canvasWidth / 2 - 40, canvasHeight / 2 + 120, 24, 48);
    ctx.fillText(`x${playerStats.arrows}`, canvasWidth / 2 + 20, canvasHeight / 2 + 150);
    ctx.drawImage(bombIcon, canvasWidth / 2 - 40, canvasHeight / 2 + 160, 24, 48);
    ctx.fillText(`x${playerStats.bombs}`, canvasWidth / 2 + 20, canvasHeight / 2 + 200);
    ctx.font = "12px Game";
    ctx.fillText("Presiona I para cerrar", canvasWidth / 2, canvasHeight / 2 + 250);
    ctx.restore();
};

Game.prototype.unlockNextLevel = function() { //desbloquear nivel si se ha completado, aparece la puerta
    this.levelExitUnlocked = true;

    let layoutName = null;
    if (this.level) layoutName = "levelClosed";
    else if (this.level2) layoutName = "level_2";
    else if (this.level3) layoutName = "level_3";
    else if (this.level4) layoutName = "level_4";
    else if (this.level5) layoutName = "level_5";
    else if (this.level6) layoutName = "level_6";
    else if (this.level7) layoutName = "level_7";
    else if (this.level8) layoutName = "level_8";
    else if (this.level9) layoutName = "level_9";
    else if (this.level10) layoutName = "level_10";
    else if (this.levelBoss) layoutName = "prologue";

    const layout = processedFloors[layoutName];
    const exitX = Math.floor(canvasWidth / 2 / tileSize);
    const exitY = 0;

    if (layout && layout[exitY]) {
        for (let dx = -1; dx <= 1; dx++) {
            const x = exitX + dx;
            if (layout[exitY][x]) {
                layout[exitY][x] = "door";
            }
        }
    }
};