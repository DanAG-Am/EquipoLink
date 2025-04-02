"use strict";

class Game {
    constructor(){
        this.createEventListeners();
        this.initObjects();
        this.showMainMenu = true;
        this.showPrologue = false;
        this.mainMap = false;
        this.level = false;
        this.enteredLevel = false;
        this.dialogueStage = 0;
        this.showTutorial = false;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.chestIsOpen = false;
        this.logo = new Image();
        this.logo.src = "../../Videojuego/Assets/MDAssets/Three.png";
        this.chestClosed = new Image();
        this.chestClosed.src = "../../Videojuego/Assets/GameAssets/Chest/chest_closed.png";
        this.chestOpened = new Image();
        this.chestOpened.src = "../../Videojuego/Assets/GameAssets/Chest/chest_open.png";
        this.chestPosition = new Vec(canvasWidth / 2 - 70, 200);
        this.chestBox = {
            position: new Vec(this.chestPosition.x, this.chestPosition.y),
            width: 32,
            height: 32
        };

        // Ahora el Old Man se gestiona desde su propia clase:
        this.oldMan = new OldMan(new Vec(canvasWidth / 2 - 16, canvasHeight / 2 - 105));

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