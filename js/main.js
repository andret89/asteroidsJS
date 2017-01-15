var States = {
    START: 0,
    GAME: 1,
    GAMEOVER: 2,
    NO_CHANGE: 3
};

var Main = function() {
    Main.fps = 60;
    Main.paused = false;
    Main.startGame = false;
    Main.endGame = false;
    Main.MUTE = false;
    Main.DEBUGBOX = false;
};

Main.prototype = {
    init: function() {
        this.screen = new Canvas();
        this.score = 0;
        this.input = new Inputs();
        this.input.init(this);
        this.menu = new Menu(this);
        this.sm = new SoundManager();
        this.sm.loadSound('audio/shoot.wav', 'shoot');
        this.sm.loadSound('audio/thrust.wav', 'fire');
        this.sm.loadSound('audio/explosion.wav', 'explosion');
        this.sm.loadSound('audio/shield.wav', 'shield');
        this.currState = null;
        this.nextState = States.START;
    },
    saveScore: function(score) {
        var hs = null;
        var state = window.localStorage.getItem("highScore");

        if (state)
            hs = JSON.parse(state);
        if (hs === null)
            hs = score;
        else if (hs <= score) {
            window.localStorage.setItem("highScore", JSON.stringify(score));
            hs = score;
        }
        return hs;
    },
    /*
     * Runs the actual loop inside browser
     */
    run: function() {
        var self = this;
        var prevTime = new Date().getTime();
        var currTime = new Date().getTime();

        function gameLoop() {
            if (self.nextState !== States.NO_CHANGE) {
                switch (self.nextState) {
                    case States.START:
                        self.currState = new Start(self);
                        break;
                    case States.GAME:
                        self.currState = new Game(self);
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
            if (!Main.paused) {
                prevTime = currTime;
                currTime = new Date().getTime();
                var dt = currTime - prevTime;
                if (dt > 0.15)
                    dt = 0.15;
            }
            self.currState.update(self.input, dt);
            self.screen.clearAll();
            self.currState.draw(self.screen);

            window.requestAnimFrame(gameLoop);
        }

        window.requestAnimFrame(gameLoop);
    }
};

/**
 * Wrapper around window.requestAnimationFrame (rAF)
 *
 * @param  {function} callback the function to animate
 */
// handle multiple browsers for requestAnimationFrame()
window.requestAnimFrame = (function(callback) {

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback) {
            window.setTimeout(callback, 1000 / Main.fps);
        };
})();

var MOUSE_GAME = true;
var DEBUG = false;

window.addEventListener('load', function() {
    var main = new Main();
    main.init();
    main.run();
}, false);

var SoundManager = function() {
    this.sounds = [];
};
SoundManager.prototype = {
    loadSound: function(url, key) {
        var s = new Audio(url);
        if (key === 'shield' && key === 'fire')
            s.volume = .06;
        this.sounds[key] = s;
    },
    stopSound: function(type) {
        var s = this.sounds[type];
        s.pause();
        s.currentTime = 0;

    },
    playSound: function(type) {
        if(Main.MUTE)
            return;

        var s = this.sounds[type];
        if (type !== 'fire') {
            s.load();
        }
        s.play();
    }
};