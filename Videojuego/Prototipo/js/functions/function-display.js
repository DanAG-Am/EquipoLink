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

    // Draw dash and shield Icon
    uiCtx.drawImage(dashImg, 0, -5, 32, 64);
    uiCtx.drawImage(shieldImg, 20, -5, 32, 64);

    // icons y stats
    uiCtx.drawImage(rupeeImg, 170, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.rupees}`, 190, 100);

    uiCtx.drawImage(potionImg, 240, 80, 16, 32);
    uiCtx.fillText(`x${playerStats.potions}`, 260, 100);

    const pos = playerStats.uiTextPosition || { x: 90, y: 30 };
    uiCtx.fillText(`LEVEL - ${playerStats.level}`, pos.x, pos.y);

    const maxBarWidth = 100;
    const barHeight = 14;
    uiCtx.fillText(`HP`, 20, 80);
    uiCtx.fillText(`MP`, 20, 120);

    const hp = Math.max(0, Math.min(playerStats.life, 100)); // clamp entre 0-100
    const hpBarWidth = (hp / 100) * maxBarWidth;
    uiCtx.fillStyle = "gray";
    uiCtx.fillRect(55, 72, maxBarWidth, barHeight);
    uiCtx.fillStyle = "red";
    uiCtx.fillRect(55, 72, hpBarWidth, barHeight);
    uiCtx.font = "7px Game";
    uiCtx.textAlign = "right";
    uiCtx.fillStyle = "white";
    uiCtx.fillText(`${playerStats.life}/100`, 130, 64);

    const mp = Math.max(0, Math.min(playerStats.mana, 100));
    const mpBarWidth = (mp / 100) * maxBarWidth;
    uiCtx.fillStyle = "gray";
    uiCtx.fillRect(55, 112, maxBarWidth, barHeight);
    uiCtx.fillStyle = "lightblue";
    uiCtx.fillRect(55, 112, mpBarWidth, barHeight);
    uiCtx.font = "7px Game";
    uiCtx.textAlign = "right";
    uiCtx.fillStyle = "white";
    uiCtx.fillText(`${playerStats.mana}/100`, 130, 105);
}

function drawChestReward(ctx) {
    if (game.chestRewardActive && game.chestReward) {
        const { type, amount } = game.chestReward;
        const boxWidth = 400;
        const boxHeight = 250;
        const boxX = canvasWidth / 2 - boxWidth / 2;
        const boxY = canvasHeight / 2 - boxHeight / 2;

        // Cuadro de fondo
        ctx.fillStyle = "black";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Texto principal
        ctx.fillStyle = "white";
        ctx.font = "24px Game";
        ctx.textAlign = "center";
        ctx.fillText("Conseguiste:", canvasWidth / 2, canvasHeight / 2 - 75);

        // Sprite del objeto
        let sprite;
        if (type === "bombs") sprite = bombIcon;
        else if (type === "arrows") sprite = arrowImg;
        else if (type === "potions") sprite = potionImg;

        if (sprite) {
            ctx.drawImage(sprite, canvasWidth / 2 - 100, canvasHeight / 2 - 2, 48, 48);
            ctx.fillText(`  x  ${amount}`, canvasWidth / 2 + 20, canvasHeight / 2 + 20);
        }

        // Texto continuar
        ctx.font = "10px Game";
        ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, canvasHeight / 2 + 100);
    }
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
    ctx.font = "10px Game";
    ctx.fillText("Volver al inicio", canvasWidth / 2, buttonY + 26);

    ctx.font = "10px Game"; // Instrucción para continuar con el juego
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
    ctx.font = "40px Game";
    ctx.textAlign = "center";
    ctx.fillText("GAME", canvasWidth / 2, boxY + 80);
    ctx.fillText("OVER", canvasWidth / 2, boxY + 120);

    const buttonWidth = 220; // Botón del regreso
    const buttonHeight = 40;
    const buttonX = canvasWidth / 2 - buttonWidth / 2;
    const buttonY = boxY + 150;
    ctx.fillStyle = "#333";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "10px Game";
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
    ctx.font = "32px Game";
    ctx.textAlign = "center";
    ctx.fillText("¡Nivel", canvasWidth / 2, canvasHeight / 2 - 40);
    ctx.fillText("Completado!", canvasWidth / 2, canvasHeight / 2);
    ctx.font = "10px Game";
    ctx.fillText("Presiona Enter para continuar", canvasWidth / 2, boxY + 160);
    ctx.restore();
}