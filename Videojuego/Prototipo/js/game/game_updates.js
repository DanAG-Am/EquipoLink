/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
// Actualiza el estado del juego procesando las acciones del jugador, las interacciones con los enemigos y otras mecánicas del juego

function playerHurtSFX() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Character/link_hurt.wav");
    sfx.volume = sfxVolume;
    sfx.play();
}

function enemyDeathSFX() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Enemy/enemy_death.wav");
    sfx.volume = sfxVolume;
    sfx.play();
}

Game.prototype.update = function(deltaTime) {
    if (this.chestRewardActive) return;
    if (this.levelBoss && this.dialogueStage3 < 2) {
        return; // No actualizamos jugador ni enemigos mientras hay diálogo
    } else if (this.levelBoss && this.levelCompleted && this.dialogueStage4 < 4) {
        return;
    }
    if (!this.showMainMenu && !this.showPrologue) {
        if (this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10 || this.levelBoss) {
            // Actualizar los enemigos en el nivel actual
            this.levelEnemies.forEach(enemy => enemy.update(deltaTime, this.player.position));
        
            // Verificar si el nivel ha sido completado
            if (
                this.totalSpawnedEnemies >= (this.maxEnemiesPerLevel[playerStats.level]) &&
                this.levelEnemies.length === 0 &&
                !this.levelCompleted
            ) {
                this.levelCompleted = true;
                if (!this.levelBoss) {
                    this.showLevelCompleteMessage = true;
                }
                this.unlockNextLevel();
            }
        } else {
            // Actualizar otros actores en el juego (entidades no enemigas)
            this.actors.forEach(actor => actor.update(deltaTime, this.player.position));
        }
        
        // Actualizar la posición y acciones del jugador
        this.player.update(deltaTime);

        // Daño por estar encima de magmaTile (aunque solo una parte del cuerpo toque magma)
        const now = Date.now();
        const playerLeft = this.player.position.x;
        const playerRight = this.player.position.x + this.player.width;
        const playerTop = this.player.position.y;
        const playerBottom = this.player.position.y + this.player.height;
        const playerMiddleY = this.player.position.y + this.player.height / 2;

        const tileLeft = Math.floor(playerLeft / tileSize);
        const tileRight = Math.floor((playerRight - 1) / tileSize);
        const tileMid = Math.floor(playerMiddleY / tileSize);
        const tileBottom = Math.floor((playerBottom - 1) / tileSize);

        const currentLayoutName = this.level ? "levelClosed" :
                                  this.level2 ? "level_2" :
                                  this.level3 ? "level_3" :
                                  this.level4 ? "level_4" :
                                  this.level5 ? "level_5" :
                                  this.level6 ? "level_6" :
                                  this.level7 ? "level_7" :
                                  this.level8 ? "level_8" :
                                  this.level9 ? "level_9" :
                                  this.level10 ? "level_10" :
                                  this.levelBoss ? "prologue" : null;

        if (currentLayoutName && processedFloors[currentLayoutName]) {
            const layout = processedFloors[currentLayoutName];

            const touchingMagma =
                layout[tileMid]?.[tileLeft] === "magma" ||
                layout[tileMid]?.[tileRight] === "magma" ||
                layout[tileBottom]?.[tileLeft] === "magma" ||
                layout[tileBottom]?.[tileRight] === "magma";

            if (touchingMagma && now - this.lastMagmaDamageTime >= 500) {
                this.lastMagmaDamageTime = now;
                playerStats.life = Math.max(0, playerStats.life - 3);

                const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/Fire/burning.mp3");
                sfx.volume = sfxVolume;
                sfx.currentTime = 0.7;
                sfx.play();

                setTimeout(() => {
                    sfx.pause();
                    sfx.currentTime = 0;
                }, 1000);
            }
        }
        
        if (this.player.swordActive) {
            const now = Date.now();
            if (now - this.lastSwordTime < 200) return; // cooldown 0.5s
            this.lastSwordTime = now;

            // Definir el área de impacto de la espada según la dirección del jugador
            let swordBox = {
                position: new Vec(this.player.position.x, this.player.position.y),
                width: this.player.width,
                height: this.player.height
            };
            const rango = 30; // rango de la espada
            
            // Ajustar el área de impacto de la espada según la dirección del jugador
            if (this.player.currentDirection === "up") {
                swordBox.position.y -= rango;
            } else if (this.player.currentDirection === "down") {
                swordBox.position.y += rango;
            } else if (this.player.currentDirection === "left") {
                swordBox.position.x -= rango;
            } else if (this.player.currentDirection === "right") {
                swordBox.position.x += rango;
            }
            
            // Ajustar el ancho y alto de la espada según la dirección
            swordBox.width = (this.player.currentDirection === "left" || this.player.currentDirection === "right") ? this.player.width + rango : this.player.width;
            swordBox.height = (this.player.currentDirection === "up" || this.player.currentDirection === "down") ? this.player.height + rango : this.player.height;
        
            // Obtener los enemigos (dependiendo del nivel actual)
            const enemigos = (this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10 || this.levelBoss) ? this.levelEnemies : this.actors;
            for (let i = enemigos.length - 1; i >= 0; i--) {
                const enemy = enemigos[i];
                if (!enemy || !enemy.position) continue;
        
                const currentTime = Date.now();

                // Verificar si la espada está tocando un enemigo
                if (boxOverlap(swordBox, {
                    position: enemy.position,
                    width: enemy.width,
                    height: enemy.height
                })) {
                    if (!enemy.lastDamageTime || currentTime - enemy.lastDamageTime > enemy.damageCooldown) {
                        enemy.life -= playerStats.damageSword;
                        enemy.lastDamageTime = currentTime;
                        if (enemy.life <= 0) {
                            enemyDeathSFX();
                            enemy.dead = true;
                            let rupeesEarned = 1; // 1 rupee por defecto
                            switch (enemy.name) { // Determina la recompensa según el tipo de enemigo
                                case "slime":
                                    rupeesEarned = Math.floor(Math.random() * 2) + 1; // 1 a 2
                                    break;
                                case "bat":
                                    rupeesEarned = Math.floor(Math.random() * 2) + 2; // 2 a 3
                                    break;
                                case "skull":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 2; // 2 a 3
                                    break;
                                case "mage":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 6; // 6 a 8
                                    break;    
                                case "knight":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 17; // 17 a 19
                                    break;
                            }
                            playerStats.enemigos_derrotados += 1;
                            playerStats.rupees += rupeesEarned;
                            playerStats.mana = Math.min(playerStats.maxMana, playerStats.mana + 10);
                        }
                    }
                }
            }
        }

        // Actualizar las flechas y verificar colisiones con enemigos
        this.arrows.forEach(a => a.update(deltaTime));
        this.arrows.forEach((arrow, i) => {
            const enemigos = (this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10 || this.levelBoss) ? this.levelEnemies : this.actors;
            enemigos.forEach((enemy, index) => {
                if (boxOverlap({
                    position: arrow.position,
                    width: arrow.width,
                    height: arrow.height
                }, {
                    position: enemy.position,
                    width: enemy.width,
                    height: enemy.height
                })) {
                    enemy.life -= playerStats.damageArrow;
                    arrow.alive = false;
                    if (enemy.life <= 0) {
                        enemyDeathSFX();
                        enemy.dead = true;
                        let rupeesEarned = 1; // 1 rupee por defecto
                        switch (enemy.name) { // Determina la recompensa según el tipo de enemigo
                            case "slime":
                                rupeesEarned = Math.floor(Math.random() * 2) + 1; // 1 a 2
                                break;
                            case "bat":
                                rupeesEarned = Math.floor(Math.random() * 2) + 2; // 2 a 3
                                break;
                            case "skull":
                                rupeesEarned = Math.floor(Math.random() * 3) + 2; // 2 a 3
                                break;
                            case "mage":
                                rupeesEarned = Math.floor(Math.random() * 3) + 6; // 6 a 8
                                break;    
                            case "knight":
                                rupeesEarned = Math.floor(Math.random() * 3) + 17; // 17 a 19
                                break;
                        }
                        playerStats.enemigos_derrotados += 1;
                        playerStats.rupees += rupeesEarned;
                        playerStats.mana = Math.min(playerStats.maxMana, playerStats.mana + 10);
                    }
                }
            });
        });
        
        // Eliminar flechas que ya no están activas
        this.arrows = this.arrows.filter(a => a.alive !== false);
        
        // Actualizar las magias y verificar colisiones con enemigos
        this.magics.forEach(m => m.update(deltaTime));
        this.magics.forEach((magic, i) => {
            const enemigos = (this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10 || this.levelBoss) ? this.levelEnemies : this.actors;
            enemigos.forEach((enemy, index) => {
                
                const currentTime = Date.now();

                // Verificar si la magia está tocando un enemigo
                if (boxOverlap({
                    position: magic.position,
                    width: magic.width,
                    height: magic.height
                }, {
                    position: enemy.position,
                    width: enemy.width,
                    height: enemy.height
                })) {
                    if (!enemy.lastDamageTime || currentTime - enemy.lastDamageTime > enemy.damageCooldown) {
                        enemy.life -= playerStats.damageSword;
                        enemy.lastDamageTime = currentTime;
                        if (enemy.life <= 0) {
                            enemyDeathSFX();
                            enemy.dead = true;
                            let rupeesEarned = 1; // 1 rupee por defecto
                            switch (enemy.name) { // Determina la recompensa según el tipo de enemigo
                                case "slime":
                                    rupeesEarned = Math.floor(Math.random() * 2) + 1; // 1 a 2
                                    break;
                                case "bat":
                                    rupeesEarned = Math.floor(Math.random() * 2) + 2; // 2 a 3
                                    break;
                                case "skull":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 2; // 2 a 3
                                    break;
                                case "mage":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 6; // 6 a 8
                                    break;    
                                case "knight":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 17; // 17 a 19
                                    break;
                            }
                            playerStats.enemigos_derrotados += 1;
                            playerStats.rupees += rupeesEarned;
                            playerStats.mana = Math.min(playerStats.maxMana, playerStats.mana + 10);
                        }
                    }
                }
            });
        });
        
        // Eliminar magias que ya no están activas
        this.magics = this.magics.filter(m => m.alive !== false);

        // Manejar las bombas y sus explosiones
        this.bombs.forEach(b => {
            if (!b.alive && !b.exploded) {
                b.exploded = true;
        
                const explosionRange = tileSize * 6;
                const bombBox = {
                    position: new Vec(b.position.x - explosionRange / 2, b.position.y - explosionRange / 2),
                    width: explosionRange,
                    height: explosionRange
                };
        
                const enemigos = (this.level || this.level2 || this.level3 || this.level4 || this.level5 || this.level6 || this.level7 || this.level8 || this.level9 || this.level10 || this.levelBoss) ? this.levelEnemies : this.actors;
                for (let i = enemigos.length - 1; i >= 0; i--) {
                    const enemy = enemigos[i];
                    if (boxOverlap(bombBox, {
                        position: enemy.position,
                        width: enemy.width,
                        height: enemy.height
                    })) {
                        enemy.life -= playerStats.damageBomb;
                        if (enemy.life <= 0) {
                            enemyDeathSFX();
                            enemy.dead = true;
                            let rupeesEarned = 1; // 1 rupee por defecto
                            switch (enemy.name) { // Determina la recompensa según el tipo de enemigo
                                case "slime":
                                    rupeesEarned = Math.floor(Math.random() * 2) + 1; // 1 a 2
                                    break;
                                case "bat":
                                    rupeesEarned = Math.floor(Math.random() * 2) + 2; // 2 a 3
                                    break;
                                case "skull":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 2; // 2 a 3
                                    break;
                                case "mage":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 6; // 6 a 8
                                    break;    
                                case "knight":
                                    rupeesEarned = Math.floor(Math.random() * 3) + 17; // 17 a 19
                                    break;
                            }
                            playerStats.enemigos_derrotados += 1;
                            playerStats.rupees += rupeesEarned;
                            playerStats.mana = Math.min(playerStats.maxMana, playerStats.mana + 10);
                        }
                    }
                };
        
                // Verificar si el jugador está cerca de la bomba
                const playerBox = {
                    position: game.player.position,
                    width: game.player.width,
                    height: game.player.height
                };
        
                if (boxOverlap(bombBox, playerBox)) {
                    playerHurtSFX();
                    playerStats.life = Math.max(0, playerStats.life - 20);
                }
            }
        });
        
        this.levelEnemies = this.levelEnemies.filter(enemy => !enemy.dead);
        this.actors = this.actors.filter(actor => !actor.dead);
        
        if (playerStats.life <= 0 && !isGameOver) {
            // Marcar el juego como terminado
            isGameOver = true;
        
            // Solo contar la muerte una vez
            if (!deathHandled) {
                playerStats.tiempo_jugado = this.getElapsedTimeInSeconds();
                playerStats.muertes += 1;
                updatePlayerStats(playerStats);
                deathHandled = true;
            }
        
            // Detener música y cronómetro
            stopAllMusic();
            gameOver.currentTime = 0;
            gameOver.play().catch(err => console.warn("Error al reproducir gameOver:", err));
            game.stopTimer();
            drawDeathMenu(ctx); // Aquí podrías incluir el menú de muerte también
        }
    }
        
};
