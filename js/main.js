var Game = function () {
    this.screen = new Canvas(600, 400);
    this.currState = null;
    this.nextState = States.MENU;
    this.input = new Inputs();
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
                        if(!self.isStart) {
                            self.currState = new GameState(self);
                        }
                        break;
                    case States.GAMEOVER:
                        self.currState = new GameOverState(self);
                        break;
                }
                self.nextState = States.NO_CHANGE;
            }


            if(!self.isPaused) {
                self.currState.inputManager(self.input);
                self.currState.update();
            }else{
                //menu manager
                self.menuManager.inputManager(self.input);
                self.menuManager.update();
            }
            if (!self.menuManager.menu.active) {
                self.currState.render(self.screen)
            }
            return window.requestAnimationFrame(gameLoop)
        }

        return window.requestAnimationFrame(gameLoop)
    }
};

var DEBUG = false;
if (!DEBUG)
    window.addEventListener('load', function () {
        var game = new Game();
        game.run()
    }, false);
else
    window.onload = function () {
        //test();
    }