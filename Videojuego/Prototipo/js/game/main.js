function main() {
    // Get a reference to the object with id 'canvas' in the page
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
    processBackgroundLayout("level_23_1");
    processBackgroundLayout("level_23_2");

    // Create the game object
    game = new Game();

    drawScene(0);
}