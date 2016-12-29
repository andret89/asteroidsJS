var Game = function () {
    this.screen = new Canvas(600, 400);
    this.currState = null;
    this.nextState = States.MENU;
    this.menu = new MainMenu();
    this.input = new Inputs();
}
Game.prototype = {
    run: function () {
        var self = this;
        self.isStart = false;
        self.input.init();

        function gameLoop() {
            if (self.nextState !== States.NO_CHANGE) {
                switch (self.nextState) {
                    case States.MENU:
                        self.currState = new MenuState(self);
                        break;
                    case States.GAME:
                        if(!self.isStart) {
                            self.currState = new GameState(self);
                            self.isStart = true
                        }
                        break;
                    case States.GAMEOVER:
                        self.currState = new GameOverState(self);
                        break;
                }
                self.nextState = States.NO_CHANGE;
            }
            self.currState.inputManager(self.input);
            self.currState.update();
            if (!self.menu.active) {
                self.currState.render(self.screen)
            }
            return window.requestAnimationFrame(gameLoop)
        }

        return window.requestAnimationFrame(gameLoop)
    }
}

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