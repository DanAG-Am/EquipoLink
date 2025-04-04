"use strict";

class Game {
    constructor(){
        this.createEventListeners();
        this.initObjects();
        this.showMainMenu = true;
        this.showPrologue = false;
        this.mainMap = false;
        this.level = false;
        this.level2 = false;
        this.level3 = false;
        this.enteredLevel = false;
        this.dialogueStage = 0;
        this.showTutorial = false;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.levelChestPosition = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 9);
        this.chestHasBeenOpened = false;
        this.chestIsOpen = false;
        this.level2ChestPosition = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 14);
        this.level2ChestIsOpen = false;
        this.level2ChestHasBeenOpened = false;
        this.level3ChestPosition = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 5);
        this.level3ChestIsOpen = false;
        this.level3ChestHasBeenOpened = false;
        this.levelCompleted = false;
        this.showLevelCompleteMessage = false;
        this.levelExitUnlocked = false;
        this.logo = new Image();
        this.logo.src = "../../Videojuego/Assets/MDAssets/Three.png";
        this.chestClosed = new Image();
        this.chestClosed.src = "../../Videojuego/Assets/GameAssets/Chest/chest_closed.png";
        this.chestOpened = new Image();
        this.chestOpened.src = "../../Videojuego/Assets/GameAssets/Chest/chest_open.png";

        // Ahora el Old Man se gestiona desde su propia clase:
        this.oldMan = new OldMan(new Vec(canvasWidth / 2 - 16, canvasHeight / 2 - 105));

        this.totalSpawnedEnemies = 0;
        this.maxEnemiesPerLevel = {
            1: 5,
            2: 8,
            3: 12
        };
        
        this.bombs = [];
        this.arrows = [];
        this.magics = [];
        this.levelEnemies = [];
        this.tienda = new Tienda();
        this.fairy = new Fairy();
    }

    initObjects() {
        this.player = new Player(new Vec(canvasWidth / 2 - 14, 305), 32, 32);
        this.actors = [];
    }

    resetGame() {
        this.showMainMenu = true;
        this.mainMap = false;
        this.dialogueStage = 0;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.initializeRupees = false;
        this.totalSpawnedEnemies = 0;

        this.actors = [];
        this.levelEnemies = [];
        if (this.levelEnemyInterval) {
            clearInterval(this.levelEnemyInterval);
            this.levelEnemyInterval = null;
        }

        this.initObjects();

        playerStats.level = 0;
        playerStats.life = 100;
        playerStats.mana = 100;
        playerStats.rupees = 0;
        playerStats.potions = 0;
        playerStats.arrows = 0;
        playerStats.bombs = 0;
    }
}