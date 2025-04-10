/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
// Main loop una vez por frame, dibujando los elementos segun el cambio en el tiempo
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    //Limpiar para volver a dibujar
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    drawUI();
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

//funciones que dibujan pantallas sobre el lienzo

// parte inferior donde se muestra la vida, mana, rupias y pociones
function drawUI() {
    uiCtx.clearRect(0, 0, canvasWidth, 150);
    uiCtx.fillStyle = "white";
    uiCtx.font = "13px Game";
    uiCtx.textAlign = "left";

    // icons y stats
    uiCtx.drawImage(rupeeImg, 140, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.rupees}`, 160, 100);

    uiCtx.fillText(`HP`, 20, 80);
    uiCtx.fillText(`x ${playerStats.life}`, 60, 80);
    uiCtx.fillText(`MP`, 20, 120);
    uiCtx.fillText(`x ${playerStats.mana}`, 60, 120);

    uiCtx.drawImage(potionImg, 230, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.potions}`, 250, 100);

    const pos = playerStats.uiTextPosition || { x: 100, y: 40 };
    uiCtx.fillText(`LEVEL - ${playerStats.level}`, pos.x, pos.y);
}

//menu de pausa que le permite al jugador retomar o regresar a la pantalla de inicio
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
    ctx.font = "35px Game";
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

//menu de gameover
function drawDeathMenu(ctx) {
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
    
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvasWidth / 2, boxY + 100);

    const buttonWidth = 220; // Botón del regreso
    const buttonHeight = 40;
    const buttonX = canvasWidth / 2 - buttonWidth / 2;
    const buttonY = boxY + 150;
    ctx.fillStyle = "#333";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Volver al inicio", canvasWidth / 2, buttonY + 26);
    
    game.gameOverButton = { // Guarda la posición del botón
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
    };
}

// Funcion de nivel completado
function drawCompleteMessage(ctx) {
    const boxWidth = 400;
    const boxHeight = 180;
    const boxX = canvasWidth / 2 - boxWidth / 2;
    const boxY = canvasHeight / 2 - boxHeight / 2;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("¡Nivel Completado!", canvasWidth / 2, canvasHeight / 2);
    ctx.font = "18px Arial";
    ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, boxY + 160);
    ctx.restore();
}