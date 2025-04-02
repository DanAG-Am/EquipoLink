// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    drawUI();
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

function drawUI() {
    uiCtx.clearRect(0, 0, canvasWidth, 150);
    uiCtx.fillStyle = "white";
    uiCtx.font = "20px Arial";
    uiCtx.textAlign = "left";

    // Draw stats with icons
    uiCtx.drawImage(rupeeImg, 140, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.rupees}`, 160, 100);

    uiCtx.fillText(`H P`, 20, 80);
    uiCtx.fillText(`x ${playerStats.life}`, 60, 80);
    uiCtx.fillText(`M P`, 20, 120);
    uiCtx.fillText(`x ${playerStats.mana}`, 60, 120);

    uiCtx.drawImage(potionImg, 230, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.potions}`, 250, 100);

    uiCtx.fillText(`LEVEL - ${playerStats.level}`, 100, 40);
}

function drawPauseMenu(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSADO", canvasWidth / 2, canvasHeight / 2 - 50);
    ctx.fillText("Presione SPACE para continuar", canvasWidth / 2, canvasHeight / 2);
    ctx.fillText("Presione ESC para salir a menu principal", canvasWidth / 2, canvasHeight / 2);

    ctx.restore();
}

function displayGameOverScreen(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2);

    ctx.restore();
}

function triggerGameOver(){
    displayGameOverScreen();
}