"use strict";

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
                rupeesInitialized = false;
                this.levelEnemyInterval = setInterval(() => {this.spawnEnemies();}, 5000);
        }
        if (this.showInventory) {
            this.drawInventory(ctx);
        }
    } else if (this.level){
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground("levelClosed", ctx);
        this.bombs.forEach(b => b.draw(ctx));
        this.arrows.forEach(a => a.draw(ctx));
        this.magics.forEach(m => m.draw(ctx));
        this.drawEnemies(ctx);
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
        if (this.levelCompleted) {
            if (this.chestIsOpen) {
                this.chestClosed = null;
                ctx.drawImage(this.chestOpened, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            } else {
                ctx.drawImage(this.chestClosed, this.levelChestPosition.x, this.levelChestPosition.y, 32, 32);
            }
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
        const boxWidth = 400;
        const boxHeight = 180;
        const boxX = canvasWidth / 2 - boxWidth / 2;
        const boxY = canvasHeight / 2 - boxHeight / 2;
    
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("¡Nivel Completado!", canvasWidth / 2, boxY + 60);
        ctx.font = "18px Arial";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, boxY + 110);
        ctx.restore();
    }
    if (isGameOver) {
        const boxWidth = 400;
        const boxHeight = 250;
        const boxX = canvasWidth / 2 - boxWidth / 2;
        const boxY = canvasHeight / 2 - boxHeight / 2;
    
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!", canvasWidth / 2, boxY + 100);

        const buttonWidth = 220; // Botón del regreso
        const buttonHeight = 40;
        const buttonX = canvasWidth / 2 - buttonWidth / 2;
        const buttonY = boxY + 150;
        ctx.fillStyle = "#333";
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.strokeStyle = "white";
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Volver al inicio", canvasWidth / 2, buttonY + 26);
    
        game.gameOverButton = { // Guarda la posición del botón
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
    }
};

Game.prototype.drawDialogue = function(ctx) {
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

Game.prototype.drawTutorial = function(ctx) {
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
};

Game.prototype.drawInventory = function(ctx) {
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

Game.prototype.unlockNextLevel = function() {
    this.levelExitUnlocked = true;

    const layout = processedFloors["levelClosed"];
    const exitX = Math.floor(canvasWidth / 2 / tileSize);
    const exitY = Math.floor(canvasHeight / tileSize) - 1;

    if (layout && layout[exitY]) {
        // Asegurarse de que los 3 tiles existen y están dentro del mapa
        for (let dx = -1; dx <= 1; dx++) {
            const x = exitX + dx;
            if (layout[exitY][x]) {
                layout[exitY][x] = "door";
            }
        }
    }
};