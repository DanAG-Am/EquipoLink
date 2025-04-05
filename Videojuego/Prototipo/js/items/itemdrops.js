/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
let rupees = [];  // Arreglo para almacenar las rupees en el juego
let rupeesInitialized = false;  // Bandera para verificar si las rupees han sido inicializadas

// Función que inicializa las rupees, colocándolas en posiciones aleatorias dentro del canvas
function initializeRupees() {
    const numSprites = Math.floor(Math.random() * 6) + 5;  // Número aleatorio de rupees (entre 5 y 10)
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

        // Verifica si el jugador está cerca de la rupee (si la posición del jugador está dentro de los límites de la rupee)
        const playerNearRupee =
            player.position.x > rupee.x - 16 && player.position.x < rupee.x + 16 &&  // Verifica si el jugador está dentro del rango horizontal
            player.position.y > rupee.y - 16 && player.position.y < rupee.y + 16;  // Verifica si el jugador está dentro del rango vertical

        // Si el jugador está cerca de la rupee
        if (playerNearRupee) {
            toRemove.push(i); // Marca esta rupee para ser eliminada en la siguiente fase
            playerStats.rupees += 1; // Aumenta el contador de rupees del jugador
        }
    }

    // Elimina las rupees que fueron marcadas para ser eliminadas
    for (let i = toRemove.length - 1; i >= 0; i--) {
        rupees.splice(toRemove[i], 1);  // Elimina la rupee en la posición marcada
    }
}

