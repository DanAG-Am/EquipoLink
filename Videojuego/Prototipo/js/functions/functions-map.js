/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
//Este código se encarga de gestionar y dibujar el fondo del mapa, incluyendo las paredes, puertas y suelos, de un juego,
// utilizando diferentes layouts.
function getWallBoxes() {
    let layoutName = null;
    
    // Determina el nombre del layout actual del juego según el nivel.
    if (game.mainMap) layoutName = "mainMap";
    else if (game.level) layoutName = "levelClosed";
    else if (game.level2) layoutName = "level_2";
    else if (game.level3) layoutName = "level_3";
    else if (game.restRoom1) layoutName = "restRoom1";  // Para una sala de descanso.

    // Si no hay un layout válido, regresa un arreglo vacío.
    if (!layoutName || !processedFloors[layoutName]) {
        return [];
    }

    // Obtiene el layout procesado del mapa actual.
    const layout = processedFloors[layoutName];
    let wallBoxes = [];

    // Recorre el layout para encontrar las posiciones de las paredes ('wall').
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            // Si la casilla contiene una pared, se agrega una caja de colisión.
            if (layout[y][x] === 'wall') {
                wallBoxes.push({
                    x: x * tileSize, // Calcula la posición X de la pared.
                    y: y * tileSize, // Calcula la posición Y de la pared.
                    width: tileSize, // Asigna el tamaño de la pared.
                    height: tileSize
                });
            }
        }
    }
    // Devuelve un arreglo con las cajas de colisión de las paredes.
    return wallBoxes;
}
