var game

function main() {
    log("main")
    game = new Game(400, 600);
    Game.animate();
}

// avvia la function main dopo che sono stati caricati tutti gli script
window.addEventListener("load", main, false);