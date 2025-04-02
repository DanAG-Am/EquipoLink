let rupees = [];  // Store rupee positions
let rupeesInitialized = false; // Flag to track initialization

// Function to initialize or reset rupees
function initializeRupees() {
    // Random number of rupees between 5 and 10
    const numSprites = Math.floor(Math.random() * 6) + 5;

    rupees = [];  // Reset the rupee array

    const margin = 40; // Set a margin from the edges

    // Create rupees at random positions, ensuring they are not too close to the perimeter
    for (let i = 0; i < numSprites; i++) {
        const xPos = Math.floor(Math.random() * (canvas.width - 2 * margin - 36)) + margin; // Random x position within the margin
        const yPos = Math.floor(Math.random() * (canvas.height - 2 * margin - 36)) + margin; // Random y position within the margin

        // Store the valid rupee's position
        rupees.push({ x: xPos, y: yPos });
    }
}

function drawRupees(ctx, player) {
    // Draw rupees at their positions
    for (let i = 0; i < rupees.length; i++) {
        const rupee = rupees[i];

        // Draw the rupee at its position
        ctx.drawImage(rupeeImg, rupee.x, rupee.y, 16, 16);

        // Check if player is near the rupee
        const playerNearRupee =
            player.position.x > rupee.x - 16 && player.position.x < rupee.x + 16 &&
            player.position.y > rupee.y - 16 && player.position.y < rupee.y + 16;

        if (playerNearRupee) {
            // Remove the rupee by splicing it from the array
            rupees.splice(i, 1);
            i--; // Adjust index because we removed an element
            playerStats.rupees += 1; // Increase player's rupee count

            // Optional: Play a sound or add an animation when a rupee is collected
        }
    }
}