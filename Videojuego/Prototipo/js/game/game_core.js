/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

//Clade Game inicializa todas las variables y sprites segun sea necesario
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
        this.restStory1 = false;
        this.restRoom1 = false;
        this.level4 = false;
        this.level5 = false;
        this.level6 = false;
        this.level7 = false;
        this.restStory2 = false;
        this.restRoom2 = false;
        this.level8 = false;
        this.level9 = false;
        this.level10 = false;
        this.restStory3 = false;
        this.restRoom3 = false;
        this.levelBoss = false;
        this.enteredLevel = false;
        this.dialogueStage = 0;
        this.dialogueStage2 = 0;
        this.dialogueStage3 = 0;
        this.dialogueStage4 = 0;
        this.showTutorial = false;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.levelChestPosition = new Vec(canvasWidth / 2 - 16, canvasHeight - tileSize * 9);
        this.chestHasBeenOpened = false;
        this.chestIsOpen = false;
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
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            "Final": 1
        };
        
        this.bombs = [];
        this.arrows = [];
        this.magics = [];
        this.levelEnemies = [];
        this.tienda = new Tienda();
        this.fairy = new Fairy();
    }

    //Crear el player y actores
    initObjects() {
        this.player = new Player(new Vec(canvasWidth / 2 - 14, 305), 32, 32);
        this.tienda = new Tienda();
        this.fairy = new Fairy();
        this.actors = [];
    }

    //regresar todo a su punto de inicio si se resetea el juego
    resetGame() {
        playerStats.level = "-";
        playerStats.uiTextPosition = { x: 100, y: 40 };
        playerStats.life = 100;
        playerStats.mana = 100;
        playerStats.rupees = 0;
        playerStats.potions = 0;
        playerStats.arrows = 0;
        playerStats.bombs = 0;

        this.mainMap = false;
        this.level = false;
        this.level2 = false;
        this.level3 = false;
        this.level4 = false;
        this.level5 = false;
        this.level6 = false;
        this.level7 = false;
        this.level8 = false;
        this.level9 = false;
        this.level10 = false;
        
        this.restRoom1 = false;
        this.restRoom2 = false;
        this.restRoom3 = false;
        
        this.restStory1 = false;
        this.restStory2 = false;
        this.restStory3 = false;

        this.levelBoss = false;

        this.showMainMenu = true;
        this.mainMap = false;
        this.dialogueStage = 0;
        this.dialogueStage2 = 0;
        this.dialogueStage3 = 0;
        this.dialogueStage4 = 0;
        this.tutorialWasShown = false;
        this.showInventory = false;
        this.initializeRupees = false;
        this.totalSpawnedEnemies = 0;
        this.levelCompleted = false;
        this.chestHasBeenOpened = false;
        this.chestIsOpen = false;
        this.levelExitUnlocked = false;
        ["prologue", "mainMap", "levelClosed", "level_2", "level_3", "level_4", "level_5", "level_6", "level_7", "level_8", "level_9", "level_10"].forEach(name => {
            processBackgroundLayout(name);
        });

        this.actors = [];
        this.levelEnemies = [];
        if (this.levelEnemyInterval) {
            clearInterval(this.levelEnemyInterval);
            this.levelEnemyInterval = null;
        }

        this.initObjects();
        this.player.velocity = new Vec(0, 0);
        this.player.setDirection("up");
    }
}