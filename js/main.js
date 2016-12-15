var game

function run() {
    log("main")
    game = new Game(400, 600);
    game.gameLoop();
}

// avvia la function main dopo che sono stati caricati tutti gli script
window.addEventListener("load", run,false);