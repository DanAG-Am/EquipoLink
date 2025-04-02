// Enemigos
Game.prototype.spawnEnemies = function() {
    const margin = 40;
    const enemyTypes = [Bat, Knight, Mage, Skull, Slime];
    const numEnemies = 1;

    const enemyList = this.level ? this.levelEnemies : this.actors;
    const enemyCount = enemyList.filter(actor =>
        actor instanceof Bat ||
        actor instanceof Knight ||
        actor instanceof Mage ||
        actor instanceof Skull ||
        actor instanceof Slime
    ).length;
    if (enemyCount >= 5) return;

    for (let i = 0; i < numEnemies; i++) {
        const xPos = Math.floor(Math.random() * (canvasWidth - 2 * margin - 32)) + margin;
        const yPos = Math.floor(Math.random() * (canvasHeight - 2 * margin - 32)) + margin;
        const EnemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const newEnemy = new EnemyClass(new Vec(xPos, yPos), 32, 32);
        this.levelEnemies.push(newEnemy);
    }
    
};
Game.prototype.drawEnemies = function(ctx) {
    this.levelEnemies.forEach(enemy => {
        enemy.draw(ctx);
    });
};