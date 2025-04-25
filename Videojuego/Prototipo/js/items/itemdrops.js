/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */


function rupeeSFX() {
    const sfx = new Audio("../../Videojuego/Assets/GameAssets/Sounds/World/5rupee_pickup.wav");
    sfx.volume = sfxVolume / 2;
    sfx.play();
}
let rupees = [];  // Arreglo para almacenar las rupees en el juego
let rupeesInitialized = false;  // Bandera para verificar si las rupees han sido inicializadas

// Función que inicializa las rupees, colocándolas en posiciones aleatorias dentro del canvas
function initializeRupees() {
    const numSprites = Math.floor(Math.random() * 6) + 10;  // Número aleatorio de rupees (entre 10 y 15)
    rupees = [];  // Resetea el arreglo de rupees
    const margin = 40;  // Margen para evitar que las rupees aparezcan demasiado cerca de los bordes

    // Genera posiciones aleatorias para cada rupee
    for (let i = 0; i < numSprites; i++) {
        let xPos, yPos;
        let validPosition = false;
        
        // Asegura que la rupee no se superponga con las paredes
        while (!validPosition) {
            xPos = Math.floor(Math.random() * (canvas.width - 2 * margin - 36)) + margin;
            yPos = Math.floor(Math.random() * (canvas.height - 2 * margin - 36)) + margin;
            validPosition = !isRupeeCollidingWithWall(xPos, yPos);  // Verifica que la rupee no choque con ninguna pared
        }
        rupees.push({ x: xPos, y: yPos });  // Añade la rupee con la posición calculada
    }
}

// Función que verifica si una rupee está colisionando con alguna pared
function isRupeeCollidingWithWall(xPos, yPos) {
    const wallBoxes = getWallBoxes();  // Obtiene las cajas de las paredes del juego
    // Itera sobre todas las paredes para verificar si la rupee colisiona con alguna de ellas
    for (let i = 0; i < wallBoxes.length; i++) {
        const wall = wallBoxes[i];
        // Verifica si la rupee está dentro del área de la pared
        if (xPos < wall.position.x + wall.width &&
            xPos + 16 > wall.position.x &&
            yPos < wall.position.y + wall.height &&
            yPos + 16 > wall.position.y) {
            return true;  // Hay colisión con una pared
        }
    }
    return false;  // No hay colisión
}

// Función que dibuja las rupees en el canvas y maneja la interacción con el jugador
function drawRupees(ctx, player) {
    const toRemove = []; // Array para almacenar las rupees a eliminar

    // Itera sobre todas las rupees en el arreglo 'rupees'
    for (let i = 0; i < rupees.length; i++) {
        const rupee = rupees[i];

        // Dibuja la imagen de la rupee en las coordenadas x, y del canvas
        ctx.drawImage(rupeeImg, rupee.x, rupee.y, 16, 16);

        const rupeeBox = { // Verifica si el jugador está cerca de la rupee (si la posición del jugador está dentro de los límites de la rupee)
            position: new Vec(rupee.x, rupee.y),
            width: 16,
            height: 16
        };
        const playerBox = {
            position: player.position,
            width: player.width,
            height: player.height
        };
        if (boxOverlap(rupeeBox, playerBox)) { // Si el jugador está cerca de la rupee
            rupeeSFX();
            toRemove.push(i);
            playerStats.rupees += 1;
        }
    }

    // Elimina las rupees que fueron marcadas para ser eliminadas
    for (let i = toRemove.length - 1; i >= 0; i--) {
        rupees.splice(toRemove[i], 1);  // Elimina la rupee en la posición marcada
    }
}

