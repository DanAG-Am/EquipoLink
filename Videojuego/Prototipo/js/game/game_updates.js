/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
// Actualiza el estado del juego procesando las acciones del jugador, las interacciones con los enemigos y otras mecánicas del juego
Game.prototype.update = function(deltaTime) {
    if (!this.showMainMenu && !this.showPrologue) {
        if (this.level || this.level2 || this.level3 || this.level4) {
            // Actualizar los enemigos en el nivel actual
            this.levelEnemies.forEach(enemy => enemy.update(deltaTime, this.player.position));
        
            // Verificar si el nivel ha sido completado
            if (
                this.totalSpawnedEnemies >= (this.maxEnemiesPerLevel[playerStats.level] || 5) &&
                this.levelEnemies.length === 0 &&
                !this.levelCompleted
            ) {
                this.levelCompleted = true;
                this.showLevelCompleteMessage = true;
            }
        } else {
            // Actualizar otros actores en el juego (entidades no enemigas)
            this.actors.forEach(actor => actor.update(deltaTime, this.player.position));
        }
        
        // Actualizar la posición y acciones del jugador
        this.player.update(deltaTime);
        
        if (this.player.swordActive) {
            // Definir el área de impacto de la espada según la dirección del jugador
            let swordBox = {
                position: new Vec(this.player.position.x, this.player.position.y),
                width: this.player.width,
                height: this.player.height
            };
            const rango = 50; // rango de la espada
            
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
            const enemigos = (this.level || this.level2 || this.level3 || this.level4) ? this.levelEnemies : this.actors;
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
                            enemigos.splice(i, 1);
                            playerStats.rupees += 1;
                            playerStats.mana = Math.min(100, playerStats.mana + 10);
                        }
                    }
                }
            }
        }

        // Actualizar las flechas y verificar colisiones con enemigos
        this.arrows.forEach(a => a.update(deltaTime));
        this.arrows.forEach((arrow, i) => {
            const enemigos = (this.level || this.level2 || this.level3 || this.level4) ? this.levelEnemies : this.actors;
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
                        enemigos.splice(index, 1);
                        playerStats.rupees += 1;
                        playerStats.mana = Math.min(100, playerStats.mana + 10);
                    }
                }
            });
        });
        
        // Eliminar flechas que ya no están activas
        this.arrows = this.arrows.filter(a => a.alive !== false);
        
        // Actualizar las magias y verificar colisiones con enemigos
        this.magics.forEach(m => m.update(deltaTime));
        this.magics.forEach((magic, i) => {
            const enemigos = (this.level || this.level2 || this.level3 || this.level4) ? this.levelEnemies : this.actors;
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
                            enemigos.splice(index, 1);
                            playerStats.rupees += 1;
                            playerStats.mana = Math.min(100, playerStats.mana + 10);
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
        
                const enemigos = (this.level || this.level2 || this.level3 || this.level4) ? this.levelEnemies : this.actors;
                enemigos.forEach((enemy, index) => {
                    if (boxOverlap(bombBox, {
                        position: enemy.position,
                        width: enemy.width,
                        height: enemy.height
                    })) {
                        enemy.life -= playerStats.damageBomb;
                        if (enemy.life <= 0) {
                            enemigos.splice(index, 1);
                            playerStats.rupees += 1;
                            playerStats.mana = Math.min(100, playerStats.mana + 10);
                        }
                    }
                });
        
                // Verificar si el jugador está cerca de la bomba
                const playerBox = {
                    position: game.player.position,
                    width: game.player.width,
                    height: game.player.height
                };
        
                if (boxOverlap(bombBox, playerBox)) {
                    playerStats.life = Math.max(0, playerStats.life - playerStats.damageBomb);
                }
            }
        });
        
        // Si la vida del jugador llega a cero, termina el juego
        if (playerStats.life <= 0 && !isGameOver) {
            isGameOver = true;
        }
    }
};
