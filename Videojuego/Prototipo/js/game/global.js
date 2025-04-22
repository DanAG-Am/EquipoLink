//variables globales
/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
"use strict";

const canvasWidth = 800;
const canvasHeight = 608;
let ctx, uiCtx, game;
let oldTime;
let playerSpeed = 0.15;
let gamePaused = false;
let interactingNPC = false;
let interactingMerchant = false;
let interactingFairy = false;
let fairyEnemyBuffActive = false;
let fairyEnemyBuffMultiplier = 1.0;
let currentItemType = "";
let isGameOver = false;
this.levelCompleted = false;
let bossKilledMusicPlayed = false;
let gameWasCompleted = false;
//tiles
const tileSize = 32;
const processedFloors = {};
const floorTile = new Image();
floorTile.src = "../../Videojuego/Assets/GameAssets/Map/Floor/floor_Tile2.png";
const floorTile2 = new Image();
floorTile2.src = "../../Videojuego/Assets/GameAssets/Map/Floor/floor_Tile3.png";
const floorTile3 = new Image();
floorTile3.src = "../../Videojuego/Assets/GameAssets/Map/Floor/floor_Tile4.png";
const floorDoor = new Image();
floorDoor.src = "../../Videojuego/Assets/GameAssets/Map/Floor/floor_Void.png";
const wallTile = new Image();
wallTile.src = "../../Videojuego/Assets/GameAssets/Map/Floor/floor_Block.png";
const grassTile = new Image();
grassTile.src = "../../Videojuego/Assets/GameAssets/Map/Floor/Grass.png";
const magmaTile = new Image();
magmaTile.src = "../../Videojuego/Assets/GameAssets/Map/Floor/Magma_3.png";
//ui Images
const tutorialImg = new Image();
tutorialImg.src = "../../Videojuego/Assets/GameAssets/HUD/Tutorial.png";
const rupeeImg = new Image();
rupeeImg.src = "../../Videojuego/Assets/GameAssets/Pickup/pickup_Rupee1.png";
const heartImg = new Image();
heartImg.src = "../../Videojuego/Assets/GameAssets/Pickup/pickup_HealthUpgrade.png";
const potionImg = new Image();
potionImg.src = "../../Videojuego/Assets/GameAssets/Pickup/pickup_PotionHealth.png";
const arrowImg = new Image();
arrowImg.src = "../../Videojuego/Assets/GameAssets/Weapons/Arrow_2.png";
const bombIcon = new Image();
bombIcon.src = "../../Videojuego/Assets/GameAssets/Weapons/Bomb_1.png";
const dashImg = new Image();
dashImg.src = "../../Videojuego/Assets/GameAssets/Keys/Dash.png";
const shieldImg = new Image();
shieldImg.src = "../../Videojuego/Assets/GameAssets/Keys/Shield.png";

let playerStats = {
    level: "-",
    life: 100,
    mana: 100,
    maxLife: 100,
    maxMana: 100,
    rupees: 0,
    potions: 0,
    arrows: 0,
    bombs: 0,
    damageSword: 10,
    damageArrow: 5,
    damageMagic: 15,
    damageBomb: 20
};