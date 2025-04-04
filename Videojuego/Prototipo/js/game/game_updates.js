"use strict";

Game.prototype.update = function(deltaTime) {
    if (!this.showMainMenu && !this.showPrologue) {
        if (this.level || this.level2) {
            this.levelEnemies.forEach(enemy => enemy.update(deltaTime, this.player.position));
        
            if (
                this.totalSpawnedEnemies >= (this.maxEnemiesPerLevel[playerStats.level] || 5) &&
                this.levelEnemies.length === 0 &&
                !this.levelCompleted
            ) {
                this.levelCompleted = true;
                this.showLevelCompleteMessage = true;
            }
        } else {
            this.actors.forEach(actor => actor.update(deltaTime, this.player.position));
        }
        this.player.update(deltaTime);
        if (this.player.swordActive) {
            let swordBox = {
                position: new Vec(this.player.position.x, this.player.position.y),
                width: this.player.width,
                height: this.player.height
            };
            const range = 50;
            if (this.player.currentDirection === "up") {
                swordBox.position.y -= range;
            } else if (this.player.currentDirection === "down") {
                swordBox.position.y += range;
            } else if (this.player.currentDirection === "left") {
                swordBox.position.x -= range;
            } else if (this.player.currentDirection === "right") {
                swordBox.position.x += range;
            }
            swordBox.width = (this.player.currentDirection === "left" || this.player.currentDirection === "right") ? this.player.width + range : this.player.width;
            swordBox.height = (this.player.currentDirection === "up" || this.player.currentDirection === "down") ? this.player.height + range : this.player.height;
        
            const enemies = (this.level || this.level2) ? this.levelEnemies : this.actors;
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                if (!enemy || !enemy.position) continue;
        
                const currentTime = Date.now();

                if (boxOverlap(swordBox, {
                    position: enemy.position,
                    width: enemy.width,
                    height: enemy.height
                })) {
                    if (!enemy.lastDamageTime || currentTime - enemy.lastDamageTime > enemy.damageCooldown) {
                        enemy.life -= playerStats.damageSword;
                        enemy.lastDamageTime = currentTime;
                        if (enemy.life <= 0) {
                            enemies.splice(i, 1);
                            playerStats.rupees += 1;
                            playerStats.mana = Math.min(100, playerStats.mana + 10);
                        }
                    }
                }
            }
        }
        this.arrows.forEach(a => a.update(deltaTime));
        this.arrows.forEach((arrow, i) => {
            const enemies = (this.level || this.level2) ? this.levelEnemies : this.actors;
            enemies.forEach((enemy, index) => {
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
                        enemies.splice(index, 1);
                        playerStats.rupees += 1;
                        playerStats.mana = Math.min(100, playerStats.mana + 10);
                    }
                }
            });
        });
        this.arrows = this.arrows.filter(a => a.alive !== false);
        this.magics.forEach(m => m.update(deltaTime));
        this.magics.forEach((magic, i) => {
            const enemies = (this.level || this.level2) ? this.levelEnemies : this.actors;
            enemies.forEach((enemy, index) => {
                
                const currentTime = Date.now();

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
                            enemies.splice(index, 1);
                            playerStats.rupees += 1;
                            playerStats.mana = Math.min(100, playerStats.mana + 10);
                        }
                    }
                }
            });
        });
        this.magics = this.magics.filter(m => m.alive !== false);
        this.bombs.forEach(b => {
            if (!b.alive && !b.exploded) {
                b.exploded = true;
        
                const explosionRange = tileSize * 6;
                const bombBox = {
                    position: new Vec(b.position.x - explosionRange / 2, b.position.y - explosionRange / 2),
                    width: explosionRange,
                    height: explosionRange
                };
        
                const enemies = this.level ? this.levelEnemies : this.actors;
                enemies.forEach((enemy, index) => {
                    if (boxOverlap(bombBox, {
                        position: enemy.position,
                        width: enemy.width,
                        height: enemy.height
                    })) {
                        enemy.life -= playerStats.damageBomb;
                        if (enemy.life <= 0) {
                            enemies.splice(index, 1);
                            playerStats.rupees += 1;
                            playerStats.mana = Math.min(100, playerStats.mana + 10);
                        }
                    }
                });
        
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
        if (playerStats.life <= 0 && !isGameOver) {
            isGameOver = true;
        }
    }
};