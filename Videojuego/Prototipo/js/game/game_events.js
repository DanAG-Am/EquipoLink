
/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

//event listeners, se aplican las teclas que se dibujaron en game draw y se hace su respectivo cambio en lo que se muestra en el lienzo
"use strict";

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
            return;
        }
        if (this.restStory1 && event.key === 'Enter') {
            this.restStory1 = false;
            this.restRoom1 = true;
            game.player.position = new Vec(canvasWidth / 2 - 16, tileSize * 2);
            return;
        }
        if (this.restStory2 && event.key === 'Enter') {
            this.restStory2 = false;
            this.restRoom2 = true;
            game.player.position = new Vec(canvasWidth / 2 - 16, tileSize * 2);
            return;
        }
        if (this.restStory3 && event.key === 'Enter') {
            this.restStory3 = false;
            this.restRoom3 = true;
            game.player.position = new Vec(canvasWidth / 2 - 16, tileSize * 2);
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
        if (this.restRoom3 && this.dialogueStage2 < 8 && event.key === 'Enter') {
            this.dialogueStage2++;
            return;
        }
        if (this.levelBoss && this.dialogueStage3 < 2 && event.key === 'Enter') {
            this.dialogueStage3++;
            return;
        }
        if (this.levelBoss && this.levelCompleted && this.dialogueStage4 < 4 && event.key === 'Enter') {
            this.dialogueStage4++;
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
            } else if (event.key == "a") {
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
            if ((this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10) && this.levelCompleted) {
                const px = this.player.position.x;
                const py = this.player.position.y;
                const cx = this.levelChestPosition.x;
                const cy = this.levelChestPosition.y;
        
                const nearLevelChest = px > cx - 36 && px < cx + 36 && py > cy - 36 && py < cy + 36;
        
                if (nearLevelChest && !this.chestHasBeenOpened) {
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
            if (playerStats.potions > 0 && playerStats.life < 100){
                playerStats.potions--;
                let lifeRegen = Math.floor(Math.random() * 20) + 10;
                playerStats.life = Math.min(playerStats.life + lifeRegen, 100);
            }
        }
        if (event.key === "Escape") {
            gamePaused = !gamePaused;
            if (gamePaused) {
                game.stopTimer();
            } else {
                game.startTimer();
            }
        }
        if (event.key === " "){ //detectar una colision antes de permiter usar space para interactuar con npc
            if (this.mainMap || this.restRoom1 || this.restRoom2 || this.restRoom3) {
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
            } else if (!game.showEndingLogo) {
                game.showEndingLogo = true;
            } else {
                game.endingScene = false;
                game.resetGame();
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
        }
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
        if (gamePaused && game.pauseButton) { //logica de pausar juego
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let clickX = (event.clientX - rect.left) * scaleX;
            let clickY = (event.clientY - rect.top) * scaleY;
        
            let btn = game.pauseButton;
            if (
                clickX >= btn.x && clickX <= btn.x + btn.width &&
                clickY >= btn.y && clickY <= btn.y + btn.height
            ) {
                gamePaused = false;
                game.resetGame();
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
};