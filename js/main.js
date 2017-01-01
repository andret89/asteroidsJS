var Game = function () {
    this.screen = new Canvas();
    this.currState = null;
    this.animationFrameID;
    this.score = 0;
    this.nextState = States.MENU;
    this.input = new Inputs(this);
    this.sm = new SoundManager();
    this.sm.loadSound('audio/shoot.wav', 'shoot');
    this.sm.loadSound('audio/thrust.wav', 'fire');
    this.sm.loadSound('audio/explosion.wav', 'explosion');
    this.sm.loadSound('audio/shield.wav', 'shield');

};

Game.prototype = {
    saveState: function(score) {
        var hs = this.restoreState();
        if(hs === null)
            hs = score;
        if(hs <= score) {
            window.localStorage.setItem("highScore", JSON.stringify(score));
            hs = score;
        }
        return hs;

    },
    restoreState :function() {
        var state = window.localStorage.getItem("highScore");
        if (state) {
            return JSON.parse(state);
        } else {
            return null;
        }

    },
    stop: function () {
        cancelAnimationFrame(this.animationFrameID);
        this.screen.clearAll();
    },
    pause : function () {
        cancelAnimationFrame(this.animationFrameID);
    },
    run: function () {
        var self = this;
        self.isStart = false;
        self.isPaused = false;
        self.input.init();

        function gameLoop() {
            if (self.nextState !== States.NO_CHANGE) {
                switch (self.nextState) {
                    case States.MENU:
                        self.currState = new MenuState(self);
                        self.menuManager = self.currState;
                        break;
                    case States.GAME:
                        if (!self.isStart) {
                            self.currState = new GameState(self);
                        }
                        break;
                    case States.GAMEOVER:
                        log("game over")
                        // TODO FIX menu game restart
                        self.currState = new GameOverState(self);
                        break;
                }
                self.nextState = States.NO_CHANGE;
            }


            if (!self.menuManager.menu.active) {
                self.currState.inputManager(self.input);
                self.currState.update();
            } else {
                //menu manager
                self.menuManager.inputManager(self.input);
                self.menuManager.update();
            }
            //if (!self.menuManager.menu.active) {
                self.currState.render(self.screen)
            //}
            return window.requestAnimFrame(gameLoop)
        }

        this.animationFrameID = window.requestAnimFrame(gameLoop)
    }
};
var MOUSE_GAME = false;
var DEBUG = false;
if (!DEBUG) {
    window.addEventListener('load', function () {
        var game = new Game();
        game.run()
    }, false);
}
else {
    window.onload = function () {
        test();
    }
}
function test() {
    var game = new Game();
    var ply = new Player({
        size: 4,
        x: game.screen.width / 4,
        y: game.screen.height / 4,
        parent: game.screen
    });
    ply.direction(Math.radians(20))
    ply.update();
    ply.draw(game.screen)

}

var SoundManager = function () {
    this.sounds = [];
};
SoundManager.prototype = {
    loadSound: function (url, key) {
        var s = new Audio(url);
        if(key === 'shield' && key === 'fire')
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
        if(type !== 'fire' )
            s.load();
        s.play();
    }
};
