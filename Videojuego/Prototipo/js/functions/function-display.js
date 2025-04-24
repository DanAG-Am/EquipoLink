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

    // Dash
    const iconX = 0;
    const iconY = -5;
    const iconWidth = 32;
    const iconHeight = 64;
    // --- Barra de recarga tipo "barra horizontal"
    const now = Date.now();
    const cooldown = game.dashCooldown;
    const elapsed = now - game.lastDashTime;
    const percent = Math.min(elapsed / cooldown, 1);
    if (percent < 1) {
        uiCtx.save();
        uiCtx.globalAlpha = 0.4; // oscurecer el ícono
        uiCtx.drawImage(dashImg, iconX, iconY, iconWidth, iconHeight);
        uiCtx.restore();
    } else {
        uiCtx.drawImage(dashImg, iconX, iconY, iconWidth, iconHeight);
    }
    if (percent < 1) {
        const barWidth = 14;
        const barHeight = 5;
        const fillWidth = barWidth * percent;
    
        const barX = iconX + iconWidth - barWidth - 12.5;
        const barY = iconY + iconHeight - 10; // justo debajo del icono
        
        uiCtx.save();
        // Fondo gris
        uiCtx.fillStyle = "gray";
        uiCtx.fillRect(barX, barY, barWidth, barHeight);
    
        // Relleno de la barra
        uiCtx.fillStyle = "aqua";
        uiCtx.fillRect(barX, barY, fillWidth, barHeight);
    
        // Borde blanco
        uiCtx.strokeStyle = "white";
        uiCtx.strokeRect(barX, barY, barWidth, barHeight);
        uiCtx.restore();
    }

    // Shield
    const shieldX = 20;
    const shieldY = -5;
    const shieldWidth = 32;
    const shieldHeight = 64;
    // --- Barra de recarga tipo "barra horizontal"
    const nowShield = Date.now();
    const cooldownShield = game.player.shieldCooldown;
    const elapsedShield = nowShield - game.player.lastShieldBlockTime;
    const percentShield = Math.min(elapsedShield / cooldownShield, 1);
    if (percentShield < 1) {
        // Oscurecer icono
        uiCtx.save();
        uiCtx.globalAlpha = 0.4;
        uiCtx.drawImage(shieldImg, shieldX, shieldY, shieldWidth, shieldHeight);
        uiCtx.restore();
    } else {
        // Icono normal
        uiCtx.drawImage(shieldImg, shieldX, shieldY, shieldWidth, shieldHeight);
    }
    if (percentShield < 1) {
        const barWidth = 14;
        const barHeight = 5;
        const fillWidth = barWidth * percentShield;
        const barX = shieldX + shieldWidth - barWidth - 12.5;
        const barY = shieldY + shieldHeight - 10;

        uiCtx.save();
        uiCtx.fillStyle = "gray";
        uiCtx.fillRect(barX, barY, barWidth, barHeight);

        uiCtx.fillStyle = "aqua";
        uiCtx.fillRect(barX, barY, fillWidth, barHeight);

        uiCtx.strokeStyle = "white";
        uiCtx.strokeRect(barX, barY, barWidth, barHeight);
        uiCtx.restore();
    }

    // icons y stats
    uiCtx.drawImage(rupeeImg, 210, 50, 16, 32);
    uiCtx.fillText(`x${playerStats.rupees}`, 230, 70);

    uiCtx.drawImage(potionImg, 210, 100, 16, 32);
    uiCtx.fillText(`x${playerStats.potions}`, 230, 120);

    const pos = playerStats.uiTextPosition || { x: 90, y: 30 };
    uiCtx.fillText(`LEVEL - ${playerStats.level}`, pos.x, pos.y);

    const maxBarWidth = 140;
    const barHeight = 14;
    uiCtx.fillText(`HP`, 20, 80);
    uiCtx.fillText(`MP`, 20, 120);

    const maxHP = playerStats.maxLife || 100;
    const hp = Math.max(0, Math.min(playerStats.life, maxHP));
    const hpBarWidth = (hp / maxHP) * maxBarWidth;
    uiCtx.fillStyle = "gray";
    uiCtx.fillRect(55, 72, maxBarWidth, barHeight);
    uiCtx.fillStyle = "red";
    uiCtx.fillRect(55, 72, hpBarWidth, barHeight);
    uiCtx.font = "7px Game";
    uiCtx.textAlign = "right";
    uiCtx.fillStyle = "white";
    uiCtx.fillText(`${playerStats.life}/${playerStats.maxLife}`, 150, 64);

    const maxMP = playerStats.maxMana || 100;
    const mp = Math.max(0, Math.min(playerStats.mana, maxMP));
    const mpBarWidth = (mp / maxMP) * maxBarWidth;
    uiCtx.fillStyle = "gray";
    uiCtx.fillRect(55, 112, maxBarWidth, barHeight);
    uiCtx.fillStyle = "lightblue";
    uiCtx.fillRect(55, 112, mpBarWidth, barHeight);
    uiCtx.font = "7px Game";
    uiCtx.textAlign = "right";
    uiCtx.fillStyle = "white";
    uiCtx.fillText(`${playerStats.mana}/${playerStats.maxMana}`, 150, 105);
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

    const buttonOptionX = canvasWidth / 2 - buttonWidth / 2;
    const buttonOptionY = boxY + 90;
    ctx.fillStyle = "#333";
    ctx.fillRect(buttonOptionX, buttonOptionY, buttonWidth, buttonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(buttonOptionX, buttonOptionY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "10px Game";
    ctx.fillText("Opción del sonido", canvasWidth / 2, buttonOptionY + 26);

    const buttonReturnX = canvasWidth / 2 - buttonWidth / 2;
    const buttonReturnY = boxY + 150;
    ctx.fillStyle = "#333";
    ctx.fillRect(buttonReturnX, buttonReturnY, buttonWidth, buttonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(buttonReturnX, buttonReturnY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "10px Game";
    ctx.fillText("Volver al inicio", canvasWidth / 2, buttonReturnY + 26);

    ctx.font = "10px Game"; // Instrucción para continuar con el juego
    ctx.fillText("Presiona ESC para regresar al juego", canvasWidth / 2, boxY + boxHeight - 30);
    ctx.restore();

    game.pauseButton = { // Guardar el posición del botón
        options: {
            x: buttonOptionX,
            y: buttonOptionY,
            width: buttonWidth,
            height: buttonHeight
        },
        return: {
            x: buttonReturnX,
            y: buttonReturnY,
            width: buttonWidth,
            height: buttonHeight
        }
    };

    if (showSoundOptions) {
        drawSoundOptions(ctx);
    }
}
function drawSoundOptions(ctx) {
    const panelWidth = 300;
    const panelHeight = 200;
    const panelX = canvasWidth / 2 - panelWidth / 2;
    const panelY = canvasHeight / 2 - panelHeight / 2;

    ctx.save();
    ctx.fillStyle = "#111";
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    ctx.fillStyle = "white";
    ctx.font = "20px Game";
    ctx.textAlign = "center";
    ctx.fillText("Sonido", canvasWidth / 2, panelY + 30);

    ctx.font = "12px Game";
    ctx.fillText("Música de fondo", canvasWidth / 2, panelY + 90);
    ctx.fillText("Efectos de sonido", canvasWidth / 2, panelY + 160);

    ctx.fillStyle = "#555";
    ctx.fillRect(panelX + 50, panelY + 100, 200, 10);
    ctx.fillRect(panelX + 50, panelY + 170, 200, 10);

    const closeSize = 25;
    const closeX = panelX + panelWidth - closeSize - 5;
    const closeY = panelY + 5;

    ctx.fillStyle = "#800";
    ctx.fillRect(closeX, closeY, closeSize, closeSize);
    ctx.strokeStyle = "white";
    ctx.strokeRect(closeX, closeY, closeSize, closeSize);
    ctx.fillStyle = "white";
    ctx.font = "18px Game";
    ctx.fillText("X", closeX + closeSize / 2 + 1, closeY + 18);

    ctx.restore();

    game.soundOptionsButton = {
        x: closeX,
        y: closeY,
        width: closeSize,
        height: closeSize
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