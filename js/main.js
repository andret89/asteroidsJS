var Game = function () {
    this.screen = new Canvas();
    this.currState = null;
    this.nextState = States.MENU;
    this.input = new Inputs(this);
    this.stateVars = {
        score: 0
    };
    this.sm = new SoundManager();
    this.sm.loadSound('audio/shoot.wav', 'shoot');
    this.sm.loadSound('audio/thrust.wav', 'fire');
    this.sm.loadSound('audio/explosion.wav', 'explosion');
    this.sm.loadSound('audio/shield.wav', 'shield');

};

Game.prototype = {
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
                        self.currState = new GameOverState(self);
                        break;
                }
                self.nextState = States.NO_CHANGE;
            }


            if (!self.isPaused) {
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

        return window.requestAnimFrame(gameLoop)
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
        if(key === 'shield' )
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
