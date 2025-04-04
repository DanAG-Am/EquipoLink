let rupees = [];
let rupeesInitialized = false;

function initializeRupees() {
    const numSprites = Math.floor(Math.random() * 6) + 5;
    rupees = [];
    const margin = 40;

    for (let i = 0; i < numSprites; i++) {
        let xPos, yPos;
        let validPosition = false;
        while (!validPosition) {
            xPos = Math.floor(Math.random() * (canvas.width - 2 * margin - 36)) + margin;
            yPos = Math.floor(Math.random() * (canvas.height - 2 * margin - 36)) + margin;
            validPosition = !isRupeeCollidingWithWall(xPos, yPos);
        }
        rupees.push({ x: xPos, y: yPos });
    }
}

function isRupeeCollidingWithWall(xPos, yPos) {
    const wallBoxes = getWallBoxes();
    for (let i = 0; i < wallBoxes.length; i++) {
        const wall = wallBoxes[i];
        if (xPos < wall.position.x + wall.width &&
            xPos + 16 > wall.position.x &&
            yPos < wall.position.y + wall.height &&
            yPos + 16 > wall.position.y) {
            return true;
        }
    }
    return false;
}

function drawRupees(ctx, player) {
    for (let i = 0; i < rupees.length; i++) {
        const rupee = rupees[i];

        ctx.drawImage(rupeeImg, rupee.x, rupee.y, 16, 16);

        const playerNearRupee =
            player.position.x > rupee.x - 16 && player.position.x < rupee.x + 16 &&
            player.position.y > rupee.y - 16 && player.position.y < rupee.y + 16;

        if (playerNearRupee) {
            rupees.splice(i, 1);
            i--;
            playerStats.rupees += 1;
        }
    }
}
