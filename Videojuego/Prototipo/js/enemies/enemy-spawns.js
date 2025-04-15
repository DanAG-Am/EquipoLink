/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
// Método para generar enemigos en el juego según el nivel del jugador.
Game.prototype.spawnEnemies = function() {
    const margin = 40; // Margen para evitar que los enemigos aparezcan demasiado cerca de los bordes.
    let enemyTypes = []; // Lista de tipos de enemigos a generar.

    // Según el nivel del jugador, se elige qué tipos de enemigos estarán disponibles para generar.
    if (playerStats.level === 1) {
        enemyTypes = [Slime];  // Solo Slime en nivel 1.
    } else if (playerStats.level === 2) {
        enemyTypes = [Slime, Bat];  // Slime y Bat en nivel 2.
    } else if (playerStats.level === 3) {
        enemyTypes = [Slime, Bat];  // Slime y Bat en nivel 3.
    } else if (playerStats.level === 4) {
        enemyTypes = [Slime, Bat, Skull]; // Slime, Bat y Skull en nivel 4.
    } else if (playerStats.level === 5){
        enemyTypes = [Bat, Skull];  // Bat y Skull en nivel 5.
    } else if (playerStats.level === 6){
        enemyTypes = [Bat, Skull, Mage];  // Bat, Skull y Mage en nivel 6.
    } else if (playerStats.level === 7){
        enemyTypes = [Skull, Mage];  // Skull y Mage en nivel 7.
    } else if (playerStats.level === 8){
        enemyTypes = [Skull, Mage, Knight];  // Skull, Mage y Knight en nivel 8.
    } else if (playerStats.level === 9){
        enemyTypes = [Mage, Knight];  // Mage y Knight en nivel 9.
    } else if (playerStats.level === 10){
        enemyTypes = [Knight];  // Knight en nivel 10.
    } else if (playerStats.level === "Final"){
        enemyTypes = [Boss];  // Jefe en nivel final.
    }

    const currentLevel = playerStats.level; // Nivel actual del jugador.
    const maxEnemies = this.maxEnemiesPerLevel[currentLevel]; // Número máximo de enemigos por nivel.
    
    // Si ya se ha alcanzado el número máximo de enemigos generados, no se genera más.
    if (this.totalSpawnedEnemies >= maxEnemies) return;

    // Calcula cuántos enemigos generar en esta llamada (mínimo 1, máximo los restantes hasta el límite).
    const numEnemiesToSpawn = Math.min(1, maxEnemies - this.totalSpawnedEnemies); 

    // Genera los enemigos.
    for (let i = 0; i < numEnemiesToSpawn; i++) {
        let spawnX, spawnY;
        let validSpawn = false;

        // Intenta encontrar una posición válida para el enemigo (que no colisione con paredes).
        while (!validSpawn) {
            // Genera una posición aleatoria dentro del área permitida (margen de seguridad).
            spawnX = Math.floor(Math.random() * (canvasWidth - 2 * margin - 32)) + margin;
            spawnY = Math.floor(Math.random() * (canvasHeight - 2 * margin - 32)) + margin;

            // Escoge un tipo de enemigo aleatorio de la lista de tipos disponibles.
            const EnemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            let newEnemy;
            if (EnemyClass === Boss) {
                newEnemy = new Boss(new Vec(spawnX, spawnY), 96, 96); // Tamaño especial para el jefe
            } else {
                newEnemy = new EnemyClass(new Vec(spawnX, spawnY), 32, 32); // Tamaño normal para enemigos
            }

            // Verifica si la nueva posición del enemigo es válida (no colisiona con las paredes).
            if (!this.isEnemyCollidingWithWall(newEnemy)) {
                validSpawn = true; // Si no hay colisión, la posición es válida.
                this.levelEnemies.push(newEnemy); // Agrega el enemigo al nivel.
                this.totalSpawnedEnemies++; // Incrementa el contador de enemigos generados.
            }
        }
    }
};

// Método para dibujar todos los enemigos en el lienzo.
Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        // Solo dibuja el enemigo si no está colisionando con una pared.
        if (!this.isEnemyCollidingWithWall(enemy)) {
            enemy.draw(ctx);
        }
    });
};
Game.prototype.drawEnemyHealthBars = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        const barWidth = 40;
        const barHeight = 5;
        const maxHp = enemy.maxLife || 20;
        const hp = Math.max(0, enemy.life);
        const hpPercent = hp / maxHp;
        const hpBarWidth = barWidth * hpPercent;

        const barX = enemy.position.x + enemy.width / 2 - barWidth / 2;
        const barY = enemy.position.y - 8; // arriba del enemigo

        ctx.fillStyle = "gray";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = "red";
        ctx.fillRect(barX, barY, hpBarWidth, barHeight);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    });
};

// Función que devuelve un array de "cajas" de colisión para las paredes del mapa.
function getWallBoxes() {
    let layoutName = null;

    // Determina qué mapa utilizar (dependiendo del nivel actual del juego).
    if (game.mainMap || game.restRoom1 || game.restRoom2 || game.restRoom3) {
        layoutName = "mainMap";
    } else if (game.level) {
        layoutName = "levelClosed";
    } else if (game.level2) {
        layoutName = "level_2";
    } else if(game.level3){
        layoutName = "level_3";
    } else if(game.level4){
        layoutName = "level_4";
    } else if(game.level5){
        layoutName = "level_5";
    } else if (game.level6){
        layoutName = "level_6";
    } else if (game.level7){
        layoutName = "level_7";
    } else if (game.level8){
        layoutName = "level_8";
    } else if (game.level9){
        layoutName = "level_9";
    } else if (game.level10){
        layoutName = "level_10";
    } else if (game.levelBoss){
        layoutName = "prologue";
    } else if (game.endingScene){
        layoutName = "ending";
    }

    const wallBoxes = [];
    const layout = processedFloors[layoutName]; // Obtiene el layout procesado del mapa actual.

    if (!layout) return wallBoxes; // Si no hay un layout válido, regresa un array vacío.

    // Recorre el layout del mapa y agrega las posiciones de las paredes al array de "cajas de colisión".
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 'wall') { // Si encuentra una pared en el layout.
                wallBoxes.push({
                    position: new Vec(x * tileSize, y * tileSize), // Calcula la posición de la pared.
                    width: tileSize,
                    height: tileSize
                });
            }
        }
    }
    return wallBoxes; // Devuelve las posiciones de todas las paredes.
}

// Función para procesar el layout de fondo del mapa, generando diferentes tipos de tiles.
function processBackgroundLayout(layoutName) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    if (!layout) return;

    const result = [];

    for (let y = 0; y < layout.length; y++) {
        const row = [];
        for (let x = 0; x < layout[y].length; x++) {
            const char = layout[y][x];

            if (char === '#') {
                row.push('wall');
            } else if (char === '-') {
                row.push('door');
            } else if (char === '@') {
                row.push('grass');
            } else {
                const rand = Math.random();
                if (rand < 0.333) {
                    row.push('floorA'); // Tile2
                } else if (rand < 0.666) {
                    row.push('floorB'); // Tile3
                } else {
                    row.push('floorC'); // Tile4
                }
            }
        }
        result.push(row);
    }

    processedFloors[layoutName] = result;
}

// Función que dibuja el fondo del mapa, usando las imágenes de los tiles.
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
            } else if (type === 'floorA') {
                ctx.drawImage(floorTile, posX, posY, tileSize, tileSize);
            } else if (type === 'floorB') {
                ctx.drawImage(floorTile2, posX, posY, tileSize, tileSize);
            } else if (type === 'floorC') {
                ctx.drawImage(floorTile3, posX, posY, tileSize, tileSize);
            } else if (type === 'door') {
                ctx.drawImage(floorDoor, posX, posY, tileSize, tileSize);
            } else if (type === 'grass') {
                ctx.drawImage(grassTile, posX, posY, tileSize, tileSize);
            }
        }
    }
}

// Método para verificar si un enemigo está colisionando con alguna pared.
Game.prototype.isEnemyCollidingWithWall = function(enemy) {
    const wallBoxes = getWallBoxes(); // Obtiene las "cajas de colisión" de las paredes.
    for (let i = 0; i < wallBoxes.length; i++) {
        const wall = wallBoxes[i]; // Obtiene una pared del array.

        // Verifica si las coordenadas del enemigo se solapan con las de la pared.
        if (enemy.position.x < wall.position.x + wall.width &&
            enemy.position.x + enemy.width > wall.position.x &&
            enemy.position.y < wall.position.y + wall.height &&
            enemy.position.y + enemy.height > wall.position.y) {
            return true; // Si hay colisión, devuelve true.
        }
    }
    return false; // Si no hay colisión, devuelve false.
};

// Método para dibujar los enemigos en el lienzo.
Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        // Solo dibuja al enemigo si no está colisionando con una pared.
        if (!this.isEnemyCollidingWithWall(enemy)) {
            enemy.draw(ctx); // Dibuja al enemigo en el contexto.
        }
    });
};
