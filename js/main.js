/**
 * Stati di gioco
 */
var States = {
    START: 0,
    GAME: 1,
    GAMEOVER: 2,
    NO_CHANGE: 3
};

/**
 * @class Gestore stati del gioco
 */
var Main = function () {
    // variabili statiche
    Main.fps = 60;
    Main.paused = false;
    Main.startGame = false;
    Main.endGame = false;
    Main.MUTE = false;
    Main.DEBUGBOX = false;
    Main.MOUSE_GAME = true;
    Main.ElasticCollision = false;

};

Main.prototype = {
    /**
     * Inizializzazione gioco
     */
    init: function () {
        // funzioni per disegnare su canvas
        this.screen = new Canvas();
        this.score = 0;
        this.levelDifficulty = 2;
        // gestore eventi in input
        this.input = new Inputs();
        this.input.init(this);
        // menu rappresentato da div html
        this.menu = new Menu(this);
        // gestore dei suoni
        this.sm = new SoundManager();
        // caricamento file audio
        this.sm.loadSound('audio/shoot.wav', 'shoot');
        this.sm.loadSound('audio/thrust.wav', 'fire');
        this.sm.loadSound('audio/explosion.wav', 'explosion');
        this.sm.loadSound('audio/shield.wav', 'shield');
        this.currState = null;
        this.nextState = States.START;
    },
    /**
     * Attivazione gameloop per l'animazione degli oggetti di gioco
     */
    run: function () {
        var self = this;
        var prevTime = 0;
        var currTime = 0;

        function gameLoop() {
            if (self.nextState !== States.NO_CHANGE) {
                switch (self.nextState) {
                    case States.START:
                        self.currState = new Start(self);
                        break;
                    case States.GAME:
                        self.currState = new Game(self);
                        self.currState.init();
                        Main.startGame = true;
                        Main.endGame = false;
                        break;
                    case States.GAMEOVER:
                        self.currState = new GameOver(self);
                        Main.startGame = false;
                        Main.endGame = true;
                        break;
                }
                self.nextState = States.NO_CHANGE;
            }

            var dt = 0;
            currTime = new Date().getTime();
            if (!Main.paused) {
                // tick del tempo per movimento oggetti
                dt = (currTime - prevTime) / 1000;
                // se troppo grande si prende un valore ragionevole
                if(dt > 0.15)
                    dt = 0.15;
            }
            // aggiorna solo gli eventi dei menu se sono attivi
            if (self.menu.active || self.menu.activeInfo || self.menu.activeDifficultly) {
                self.menu.update(self.input);
            }
            else
                self.currState.update(self.input, dt);

            self.screen.clearAll();
            self.currState.draw(self.screen);

            prevTime = currTime;


            window.requestAnimFrame(gameLoop);
        }

        gameLoop();
    },
    /**
     * Salva in memoria il punteggio più alto
     *
     * @param  {number} score - punteggio finale del giocatore
     * @returns {number} highscore
     */
    saveScore: function (score) {
        var hs = null;
        var state = window.localStorage.getItem("highScore");

        if (state)
            hs = JSON.parse(state);

        if (hs === null)
            hs = 0;

        if (hs <= score) {
            window.localStorage.setItem("highScore", JSON.stringify(score));
            hs = score;
        }
        return hs;
    }
};

/**
 * Richiesta al supporto di eseguire un frame
 * Polyfill per window.requestAnimationFrame
 *
 * @param  {function} callback - funzione eseguita ad ogni frame
 */
window.requestAnimFrame = (function (callback) {

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback) {
            window.setTimeout(callback, 1000 / Main.fps);
        };
})();

/**
 * Registazione all'evento di fine caricamento del dom
 * l'avvio dell'oggetto main
 */
window.addEventListener('load', function () {
    var main = new Main();
    main.init();
    main.run();
}, false);