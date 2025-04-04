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
        if ((this.mainMap || this.level || this.level2 || this.level3) && this.dialogueStage >= 5 && !this.showTutorial && !isGameOver && !this.showLevelCompleteMessage) {
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
            if (this.level && this.levelCompleted) {
                const px = this.player.position.x;
                const py = this.player.position.y;
                const cx = this.levelChestPosition.x;
                const cy = this.levelChestPosition.y;
        
                const nearLevelChest = px > cx - 36 && px < cx + 36 && py > cy - 36 && py < cy + 36;
        
                if (nearLevelChest && !this.chestHasBeenOpened) {
                    this.chestIsOpen = true;
        
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
            if (this.level2 && this.levelCompleted) {
                const px = this.player.position.x;
                const py = this.player.position.y;
                const cx = this.level2ChestPosition.x;
                const cy = this.level2ChestPosition.y;
            
                const nearLevelChest = px > cx - 36 && px < cx + 36 && py > cy - 36 && py < cy + 36;
            
                if (nearLevelChest && !this.level2ChestHasBeenOpened) {
                    this.level2ChestIsOpen = true;
                    let item = Math.random();
                    if (item <= 0.33) {
                        playerStats.bombs += 1;
                    } else if (item <= 0.66) {
                        playerStats.arrows += 1;
                    } else {
                        playerStats.potions += 1;
                    }
                    this.level2ChestHasBeenOpened = true;
                }
            }
            if (this.level3 && this.levelCompleted) {
                const px = this.player.position.x;
                const py = this.player.position.y;
                const cx = this.level3ChestPosition.x;
                const cy = this.level3ChestPosition.y;
            
                const nearLevelChest = px > cx - 36 && px < cx + 36 && py > cy - 36 && py < cy + 36;
            
                if (nearLevelChest && !this.level3ChestHasBeenOpened) {
                    this.level3ChestIsOpen = true;
                    let item = Math.random();
                    if (item <= 0.33) {
                        playerStats.bombs += 1;
                    } else if (item <= 0.66) {
                        playerStats.arrows += 1;
                    } else {
                        playerStats.potions += 1;
                    }
                    this.level3ChestHasBeenOpened = true;
                }
            }
        }
        if (event.key == "d") {
            if (playerStats.potions > 0 && playerStats.life < 100){
                playerStats.potions--;
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
    });

    window.addEventListener('keyup', (event) => {
        if ((this.mainMap || this.level || this.level2 || this.level3) && !this.showTutorial) {
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
        if (gamePaused && game.pauseButton) {
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
        if (isGameOver && game.gameOverButton) {
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
        if (interactingFairy && game.fairy.button) {
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
};