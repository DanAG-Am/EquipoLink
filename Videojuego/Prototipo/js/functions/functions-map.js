function getWallBoxes() {
    let layoutName = null;
    
    if (game.mainMap) layoutName = "mainMap";
    else if (game.level) layoutName = "levelClosed";
    else if (game.level2) layoutName = "level_2";
    else if (game.level3) layoutName = "level_3";
    else if (game.restRoom1) layoutName = "restRoom1";

    if (!layoutName || !processedFloors[layoutName]) {
        return [];
    }

    const layout = processedFloors[layoutName];
    let wallBoxes = [];

    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 'wall') {
                wallBoxes.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize
                });
            }
        }
    }
    return wallBoxes;
}

function processBackgroundLayout(layoutName) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    const result = [];
    for (let y = 0; y < layout.length; y++) {
        const row = [];
        for (let x = 0; x < layout[y].length; x++) {
            const char = layout[y][x];
            if (char === '#') {
                row.push('wall');
            } else if (char === '-') {
                row.push('door');
            } else {
                const rand = Math.random();
                row.push(rand < 0.1 ? 'floor1' : 'floor2');
            }
        }
        result.push(row);
    }
    processedFloors[layoutName] = result;
}

function drawBackground(layoutName, ctx) {
    const layout = BACKGROUND_LAYOUTS[layoutName];
    const floorData = processedFloors[layoutName];
    if (!layout || !floorData) return;
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            const type = floorData[y][x];
            const posX = x * tileSize;
            const posY = y * tileSize;
            if (type === 'wall') {
                ctx.drawImage(wallTile, posX, posY, tileSize, tileSize);
            } else if (type === 'floor1') {
                ctx.drawImage(floorTile1, posX, posY, tileSize, tileSize);
            } else if (type === 'floor2') {
                ctx.drawImage(floorTile2, posX, posY, tileSize, tileSize);
            } else if (type === 'door') {
                ctx.drawImage(floorDoor, posX, posY, tileSize, tileSize);
            }
        }
    }
}

