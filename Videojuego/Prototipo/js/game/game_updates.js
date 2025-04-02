"use strict";

Game.prototype.update = function(deltaTime) {
    if (!this.showMainMenu && !this.showPrologue) {
        if (this.level) {
            this.levelEnemies.forEach(enemy => enemy.update(deltaTime, this.player.position));
        } else {
            this.actors.forEach(actor => actor.update(deltaTime, this.player.position));
        }
        this.player.update(deltaTime);
        this.arrows.forEach(a => a.update(deltaTime));
        this.arrows = this.arrows.filter(a => a.alive !== false);
        this.magics.forEach(m => m.update(deltaTime));
        this.magics = this.magics.filter(m => m.alive !== false);
    }
};