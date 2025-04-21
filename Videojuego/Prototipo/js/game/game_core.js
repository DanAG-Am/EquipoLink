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
        this.lastSwordTime = 0;
        this.lastArrowTime = 0;
        this.lastMagicTime = 0;
        this.lastBombTime = 0;
        this.dashCooldown = 1000; // tiempo entre dash
        this.lastDashTime = 0;
        this.dashDistance = 64; // distancia del dash
        this.lastShieldTime = 0;
        this.shieldCooldown = 10000; // 10 segundos
        this.shieldDuration = 2000;  // 2 segundos
        this.shieldActiveUntil = 0;  // cuándo termina el escudo    
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
        this.endingScene = false;
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
        this.titleVideo = document.createElement('video');
        this.titleVideo.src = '../../Videojuego/Assets/GameAssets/GameIntro/Title_Screen.mp4';
        this.titleVideo.muted = true;
        this.titleVideo.loop = true;
        this.titleVideo.playsInline = true;
        this.titleVideo.play();
        this.lastMagmaDamageTime = 0;
        this.logo = new Image();
        this.logo.src = "../../Videojuego/Assets/HTMLAssets/logo.png";
        this.chestClosed = new Image();
        this.chestClosed.src = "../../Videojuego/Assets/GameAssets/Chest/chest_closed.png";
        this.chestOpened = new Image();
        this.chestOpened.src = "../../Videojuego/Assets/GameAssets/Chest/chest_open.png";
        this.chestRewardActive = false;
        this.chestReward = null;
        this.endingScene = false;
        this.endingDialogueStage = 0;
        this.showEndingLogo = false;
        this.playerReachedCenter = false;
        this.endingTextFinished = false;

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

        this.startTime = null; // Constructor para el temporizador
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isTimerRunning = false;
        this.initializeRupees = false;
        this._wasPaused = false;
        this._wasInPrologue = false;
        this._wasInEnding = false;
        this._wasDead = false;
    }

    startTimer() {
        if (!this.isTimerRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateTimerDisplay();
            }, 1000); // actualiza cada segundo
            this.isTimerRunning = true;
        }
    }
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isTimerRunning = false;
    }
    resetTimer() {
        this.stopTimer();
        this.elapsedTime = 0;
        this.startTime = null;
        this.updateTimerDisplay();
    }
    updateTimerDisplay() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const timerDiv = document.getElementById("gameTimer");
        if (timerDiv) timerDiv.textContent = `Tiempo - ${formattedTime}`;
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
        playerStats.uiTextPosition = { x: 90, y: 30 };
        playerStats.life = playerStats.maxLife;
        playerStats.mana = playerStats.maxMana;
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
        this.endingScene = false;
        this.playerReachedCenter = false;
        this.endingDialogueStage = 0;
        this.showEndingLogo = false;

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
        ["prologue", "mainMap", "levelClosed", "level_2", "level_3", "level_4", "level_5", "level_6", "level_7", "level_8", "level_9", "level_10", "ending"].forEach(name => {
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
        this.resetTimer();
    }
}