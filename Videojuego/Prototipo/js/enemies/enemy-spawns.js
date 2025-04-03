// Enemigos
Game.prototype.spawnEnemies = function() {
    const margin = 40;
    const enemyTypes = [Bat, Knight, Mage, Skull, Slime];
    const currentLevel = playerStats.level;

    const maxEnemies = this.maxEnemiesPerLevel[currentLevel];
    if (this.totalSpawnedEnemies >= maxEnemies) return;

    const numEnemiesToSpawn = Math.min(1, maxEnemies - this.totalSpawnedEnemies); 

    for (let i = 0; i < numEnemiesToSpawn; i++) {
        const xPos = Math.floor(Math.random() * (canvasWidth - 2 * margin - 32)) + margin;
        const yPos = Math.floor(Math.random() * (canvasHeight - 2 * margin - 32)) + margin;
        const EnemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const newEnemy = new EnemyClass(new Vec(xPos, yPos), 32, 32);
        this.levelEnemies.push(newEnemy);
        this.totalSpawnedEnemies++;
    }
};
Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        enemy.draw(ctx);
    });
};