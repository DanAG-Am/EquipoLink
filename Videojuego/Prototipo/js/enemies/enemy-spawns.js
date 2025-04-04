Game.prototype.spawnEnemies = function() {
    const margin = 40;
    let enemyTypes = [];
    if (playerStats.level === 1) {
        enemyTypes = [Slime];
    } else if (playerStats.level === 2) {
        enemyTypes = [Slime, Bat];
    } else if (playerStats.level === 3) {
        enemyTypes = [Slime, Bat];
    }

    const currentLevel = playerStats.level;
    const maxEnemies = this.maxEnemiesPerLevel[currentLevel];
    if (this.totalSpawnedEnemies >= maxEnemies) return;
    const numEnemiesToSpawn = Math.min(1, maxEnemies - this.totalSpawnedEnemies); 

    for (let i = 0; i < numEnemiesToSpawn; i++) {
        let spawnX, spawnY;
        let validSpawn = false;

        // Try finding a valid spawn position
        while (!validSpawn) {
            spawnX = Math.floor(Math.random() * (canvasWidth - 2 * margin - 32)) + margin;
            spawnY = Math.floor(Math.random() * (canvasHeight - 2 * margin - 32)) + margin;

            // Create the new enemy at this spawn position
            const EnemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const newEnemy = new EnemyClass(new Vec(spawnX, spawnY), 32, 32);

            // Check if the spawn position is valid (not colliding with walls)
            if (!this.isEnemyCollidingWithWall(newEnemy)) {
                validSpawn = true;
                this.levelEnemies.push(newEnemy);
                this.totalSpawnedEnemies++;
            }
        }
    }
};


Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        if (!this.isEnemyCollidingWithWall(enemy)) {
            enemy.draw(ctx);
        }
    });
};

function getWallBoxes() {
    let layoutName = null;
    if (game.mainMap) {
        layoutName = "mainMap";
    } else if (game.level) {
        layoutName = "levelClosed";
    } else if (game.level2) {
        layoutName = "level_2";
    }
    else if(game.level3){
        layoutName = "level_3";
    }
    const wallBoxes = [];
    const layout = processedFloors[layoutName];
    if (!layout) return wallBoxes;
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 'wall') {
                wallBoxes.push({
                    position: new Vec(x * tileSize, y * tileSize),
                    width: tileSize,
                    height: tileSize
                });
            }
        }
    }
    return wallBoxes;
}

function processBackgroundLayout(layoutName) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    const result = [];
    for (let y = 0; y < layout.length; y++) {
        const row = [];
        for (let x = 0; x < layout[y].length; x++) {
            const char = layout[y][x];
            if (char === '#') {
                row.push('wall');
            } else if (char === '-') {
                row.push('door');
            } else {
                const rand = Math.random();
                row.push(rand < 0.1 ? 'floor1' : 'floor2');
            }
        }
        result.push(row);
    }
    processedFloors[layoutName] = result;
}

function drawBackground(layoutName, ctx) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    const floorData = processedFloors[layoutName];
    if (!layout || !floorData) return;
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            const type = floorData[y][x];
            const posX = x * tileSize;
            const posY = y * tileSize;
            if (type === 'wall') {
                ctx.drawImage(wallTile, posX, posY, tileSize, tileSize);
            } else if (type === 'floor1') {
                ctx.drawImage(floorTile1, posX, posY, tileSize, tileSize);
            } else if (type === 'floor2') {
                ctx.drawImage(floorTile2, posX, posY, tileSize, tileSize);
            } else if (type === 'door') {
                ctx.drawImage(floorDoor, posX, posY, tileSize, tileSize);
            }
        }
    }
}

Game.prototype.isEnemyCollidingWithWall = function(enemy) {
    const wallBoxes = getWallBoxes();
    for (let i = 0; i < wallBoxes.length; i++) {
        const wall = wallBoxes[i];
        if (enemy.position.x < wall.position.x + wall.width &&
            enemy.position.x + enemy.width > wall.position.x &&
            enemy.position.y < wall.position.y + wall.height &&
            enemy.position.y + enemy.height > wall.position.y) {
            return true;
        }
    }
    return false;
};

Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        if (!this.isEnemyCollidingWithWall(enemy)) {
            enemy.draw(ctx);
        }
    });
};
