/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

"use strict";

// Dibuja el estado actual del juego
Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (this.showMainMenu) {
        ctx.drawImage(this.logo, canvasWidth / 2 - 228, 80, 450, 450);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Presiona Enter para empezar el juego", canvasWidth / 2, 570);
    } else if (this.showPrologue){
        drawBackground("prologue", ctx);
        playerStats.level = "Cave";
        playerStats.uiTextPosition = { x: 85, y: 40 };
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
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
        ctx.font = "20px Arial";
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
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.player.draw(ctx);
        if (this.dialogueStage < 5) {
            this.drawDialogue(ctx);
            ctx.font = "15px Arial";
            ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, 190, 600, 100);
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
                this.player.position = new Vec(canvasWidth / 2 - 16, tileSize);
                playerStats.level = 1;
                playerStats.uiTextPosition = { x: 100, y: 40 };
                rupeesInitialized = false;
                this.levelEnemyInterval = setInterval(() => {this.spawnEnemies();}, 5000);
        }
        if (this.showInventory) {
            this.drawInventory(ctx);
        }
    } else if (this.level){ //dibujar el primer nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("levelClosed", ctx);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
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
        if (this.player.position.y + this.player.height >= canvasHeight && //transicion entre nivel 1 y 2, se repite la misma estructura en el resto de los niveles
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            this.level = false;
            this.level2 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, tileSize);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.level2ChestIsOpen = false;
            this.level2ChestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.level2) { //dibujar el segundo nivel
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_2", ctx);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
        if (this.levelCompleted) {
            if (this.level2ChestIsOpen) {
                ctx.drawImage(this.chestOpened, this.level2ChestPosition.x, this.level2ChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.level2ChestPosition.x, this.level2ChestPosition.y, 32, 32);
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

        if (this.player.position.y + this.player.height >= canvasHeight && //tranisicion entre nivel 2 y 3
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
            this.level2 = false;
            this.level3 = true;
            this.player.position = new Vec(canvasWidth / 2 - 16, tileSize);
            this.totalSpawnedEnemies = 0;
            this.levelEnemies = [];
            this.levelCompleted = false;
            this.level3ChestIsOpen = false;
            this.level3ChestHasBeenOpened = false;
            this.levelExitUnlocked = false;
            rupeesInitialized = false;
            playerStats.level += 1;
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } 
    else if (this.level3) { //dibujar nivel 3
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("level_3", ctx);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        if (this.levelCompleted) {
            if (this.level3ChestIsOpen) {
                ctx.drawImage(this.chestOpened, this.level3ChestPosition.x, this.level3ChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.level3ChestPosition.x, this.level3ChestPosition.y, 32, 32);
            }
        }
        this.player.draw(ctx);
        if (!rupeesInitialized) {
            initializeRupees();
            rupeesInitialized = true;
        }
        drawRupees(ctx, this.player);
        this.drawEnemies(ctx);
    
        if (this.showInventory) {
            this.drawInventory(ctx);
        } else if (this.showTutorial) {
            this.drawTutorial(ctx);
        }

        if (this.player.position.y + this.player.height >= canvasHeight && //transicion entre nivel 3 y cuarto de descanso y mejoras
            this.player.position.x >= canvasWidth / 2 - 50 &&
            this.player.position.x + this.player.width <= canvasWidth / 2 + 50) {
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
            playerStats.uiTextPosition = { x: 85, y: 40 };
            game.player.velocity = new Vec(0, 0);
            this.levelEnemyInterval = setInterval(() => { this.spawnEnemies(); }, 5000);
        }
    } else if (this.restStory1){ //se le proporciona una parte de la historia al jugador
        drawBackground("prologue", ctx);
        ctx.fillStyle = "black";
        ctx.fillRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight / 2 - 180, canvasWidth / 4 + 400, canvasHeight / 2 + 70);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Historia 1", canvasWidth / 2, 185);
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        const prologueText = [
            "En una cámara oscura, Sentinel descubre una antigua inscripción en",
            "la pared cubierta de musgo. Al tocarla, un dolor agudo le atraviesa",
            "la cabeza. Un recuerdo emerge: Gritos. Llamas devorando su aldea.",
            "Una sombra oscura, con ojos carmesí, blandiendo una espada negra.",
            "Sentinel, de rodillas, herido. Una voz femenina susurra en su oído:",
            "'Corre… eres nuestra última esperanza.'"
        ];
        let yPosition = canvasHeight / 4 + 75;
        prologueText.forEach(line => {
            ctx.fillText(line, canvasWidth / 2, yPosition);
            yPosition += 50;
        });
        ctx.font = "20px Arial";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 4 + canvasHeight / 2 + 70);
    } else if (this.restRoom1){ //dibujar el cuarto de descanso
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("restRoom1", ctx);
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
};

Game.prototype.drawDialogue = function(ctx) { //dibujar dialogos del viejo
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
};

Game.prototype.drawTutorial = function(ctx) { //dibujar el turorial
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth / 2 - 300, 100, 600, 400);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 300, 100, 600, 400);
    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tutorial de Controles", canvasWidth / 2, 150);
    const controlName = [
        "Para mover",
        
        "Atacar con espada",
        "Atacar con arco",
        "Atacar con magia",
        "Dejar bomba",
        "Tomar poción",
        
        "Interactuar con cofres",
        "Interactuar con NPCs",
        
        "Abrir inventario",
        "Abrir tutorial",
        
        "Menu de pausa"
    ];
    const controlKey = [
        "← ↑ ↓ →",
        
        "Z",
        "X",
        "C",
        "A",
        "D",
        
        "O",
        "SPACE",
        
        "I",
        "T",
        
        "ESC"
    ];
    ctx.font = "14px Arial";
    let yPosition = 180;
    ctx.textAlign = "left";
    controlName.forEach(line => {
        ctx.fillText(line, canvasWidth / 2 - 170, yPosition);
        yPosition += 30;
    });
    yPosition = 180;
    controlKey.forEach(line => {
        ctx.fillText(line, canvasWidth / 2 + 100, yPosition);
        yPosition += 30;
    });
    ctx.font = "20px Arial";
    ctx.fillText("Presiona T para continuar", canvasWidth / 2 - 120, 530);
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
};

Game.prototype.unlockNextLevel = function() { //desbloquear nivel si se ha completado, aparece la puerta
    this.levelExitUnlocked = true;

    let layoutName = null;
    if (this.level) layoutName = "levelClosed";
    else if (this.level2) layoutName = "level_2";
    else if (this.level3) layoutName = "level_3";

    const layout = processedFloors[layoutName];
    const exitX = Math.floor(canvasWidth / 2 / tileSize);
    const exitY = Math.floor(canvasHeight / tileSize) - 1;

    if (layout && layout[exitY]) {
        for (let dx = -1; dx <= 1; dx++) {
            const x = exitX + dx;
            if (layout[exitY][x]) {
                layout[exitY][x] = "door";
            }
        }
    }
};