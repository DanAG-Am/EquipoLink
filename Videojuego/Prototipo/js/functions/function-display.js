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
    const boxWidth = 400;
    const boxHeight = 250;
    const boxX = canvasWidth / 2 - boxWidth / 2;
    const boxY = canvasHeight / 2 - boxHeight / 2;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = "white"; // Texto
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSA", canvasWidth / 2, boxY + 60);

    const buttonWidth = 200; // Botón para regresar al inicio
    const buttonHeight = 40;
    const buttonX = canvasWidth / 2 - buttonWidth / 2;
    const buttonY = boxY + 110;
    ctx.fillStyle = "#333";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Volver al inicio", canvasWidth / 2, buttonY + 26);

    ctx.font = "16px Arial"; // Instrucción para continuar con el juego
    ctx.fillText("Presiona ESC para regresar al juego", canvasWidth / 2, boxY + boxHeight - 30);
    ctx.restore();

    game.pauseButton = { // Guardar el posición del botón
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    };
}