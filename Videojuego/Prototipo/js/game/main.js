/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */
//en main, solamente llamamos los mapas y el canvas para dibujarlos
function main() {
    // Get a reference to the object with id 'canvas' in the page //referencia de objeto a traves de su id
    const canvas = document.getElementById('canvas');
    const uiCanvas = document.getElementById("uiCanvas");
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D 
    ctx = canvas.getContext('2d')
    uiCtx = uiCanvas.getContext("2d");

    processBackgroundLayout("prologue");
    processBackgroundLayout("mainMap");
    processBackgroundLayout("levelClosed");
    processBackgroundLayout("level_2");
    processBackgroundLayout("level_3");
    processBackgroundLayout("level_4");
    processBackgroundLayout("level_5");
    processBackgroundLayout("level_6");
    processBackgroundLayout("level_7");
    processBackgroundLayout("level_8");
    processBackgroundLayout("level_9");
    processBackgroundLayout("level_10");
    processBackgroundLayout("ending");

    // Create the game object //crear juego para que todo lo que esta en esa clase se dibuje
    game = new Game();

    drawScene(0);
}