var States = {
    INFO : 0, GAME:1, PAUSE:2,GAMEOVER:3
};

var Main = function () {
    Main.fps = 60;
    Main.paused = false;
    Main.startGame = false;
    Main.startGameOver = false;
    Main.state = States.INFO;
};

Main.prototype = {
    init: function () {
        this.screen = new Canvas();
        this.score = 0;
        this.input = new Inputs();
        this.input.init(this);
        this.info = new StartInfo(this);
        this.menu = new Menu(this);
        this.sm = new SoundManager();
        this.sm.loadSound('audio/shoot.wav', 'shoot');
        this.sm.loadSound('audio/thrust.wav', 'fire');
        this.sm.loadSound('audio/explosion.wav', 'explosion');
        this.sm.loadSound('audio/shield.wav', 'shield');
    },
    initState:function () {
        switch (Main.state) {
            case States.GAME:
                if(!Main.startGame) {
                    this.game = new Game(this);
                    Main.startGame = true;
                }
                break;
            case States.GAMEOVER:
                if(!Main.startGameOver) {
                    this.gameOver = new GameOver(this);
                    Main.startGameOver = true;
                    Main.startGame = false;
                }
                break
        }
    },
    update: function (tick) {
        this.initState();
        switch (Main.state) {
            case States.INFO:
                this.info.update(this.input);
                break;
            case States.GAME:
                if (this.menu.active)
                    this.menu.update(this.input);
                else
                    if (!Main.paused && Main.startGame)
                        this.game.update(this.input,tick);
                break;
            case States.PAUSE:
                if (this.menu.active)
                    this.menu.update(this.input);
                break;
            case States.GAMEOVER:
                if (this.menu.active)
                    this.menu.update(this.input);
                else if(Main.startGameOver)
                    this.gameOver.update(this.input);
                break;
        }
    },
    render: function () {
        this.screen.clearAll();
        switch (Main.state) {
            case States.INFO:
                this.info.draw(this.screen);
                break;
            case States.GAME:
                if(Main.startGame)
                    this.game.draw(this.screen);
                break;
            case States.GAMEOVER:
                if(Main.startGameOver)
                    this.gameOver.draw(this.screen);
                break;
            case States.PAUSE:
                if (Main.startGame)
                    this.game.draw(this.screen);
                break;
        }

    },
    pause: function () {
        Main.paused = (Main.paused) ? false : true;
    },
    saveScore: function (score) {
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
    run: function () {
        var prevTime = new Date().getTime();
        var currTime = new Date().getTime();
        var self = this;
        function gameLoop() {
            prevTime = currTime;
            currTime = new Date().getTime();
            var dt = currTime - prevTime;
            if(dt > 0.15)
                dt = 0.15;

            self.update(dt);
            self.render();
            window.requestAnimFrame(gameLoop)
        }

        window.requestAnimFrame(gameLoop)
    }
};

/**
 * Wrapper around window.requestAnimationFrame (rAF)
 *
 * @param  {function} callback the function to animate
 */
// handle multiple browsers for requestAnimationFrame()
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

var MOUSE_GAME = true;
var DEBUG_BOX = false;
var DEBUG = false;

window.addEventListener('load', function () {
        var main = new Main();
        main.init();
        main.run();
    }, false);
var SoundManager = function () {
    this.sounds = [];
};
SoundManager.prototype = {
    loadSound: function (url, key) {
        var s = new Audio(url);
        if (key === 'shield' && key === 'fire')
            s.volume = .06;
        this.sounds[key] = s;
    },
    stopSound: function (type) {
        var s = this.sounds[type];
        s.pause();
        s.currentTime = 0;

    },
    playSound: function (type) {
        var s = this.sounds[type];
        if (type !== 'fire')
            s.load();
        s.play();
    }
};
