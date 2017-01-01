/**
 * Created by andre on 28/12/16.
 */
var Button = {
    startGame: 0,
    resumeGame: 1,
    exitGame: 2,
    highScore: 3,
    options: 4,
    credits: 5,
    noChoice: 6
};

var MenuState = State.extend(
    function MenuState(game) {
        this.game = game;
        this.menu = new MainMenu();
        this.menu.enable();
        this.game.isPaused = true;
    },
    {
        inputManager: function (input) {
            if(input.isPressed('KEY_ESC') || input.isPressed('KEY_P')){
                if (this.game.isStart) {
                    log("pause");
                    MainMenu.menuChoice = Button.resumeGame;
                }
            }
        },
        update: function () {
            switch (MainMenu.menuChoice) {
                case Button.startGame:
                    console.log("startGame");
                    utils.setVisibility("startGame", 'none');
                    utils.setVisibility("resumeGame", 'block');
                    this.menu.disable();
                    this.game.isPaused = false;
                    this.game.nextState = States.GAME;
                    break;
                case Button.resumeGame:
                    console.log("resumeGame");
                    this.menu.disable();
                    this.game.isPaused = false;
                    break;
                case Button.exitGame:
                    if(this.game.isStart) {
                        console.log("exitGame");
                        utils.setVisibility("resumeGame", 'none');
                        utils.setVisibility("startGame", 'block');
                        this.game.isStart = false;
                        //this.game.nextState = States.GAMEOVER;
                    }
                    break;
                case Button.highScore:
                    new HighScoreMenu().draw();
                    break;
                case Button.options:
                    new Options().draw();
                    break;
                case Button.credits:
                    new Credits().draw();
                    break;
            }
            //log(MainMenu.menuChoice)
            MainMenu.menuChoice = Button.noChoice;

        },
        render: function (g) {
            g.clearAll();
            var ga = g.ctx
            ga.fillStyle = "white";
            ga.font = "40px sans-serif";
            var s ="ASTEROIDS GAME";
            g.fillTextMultiLine(s, g.canvas.width/2-(s.length+100),100);
        }
    });

var HighScoreMenu = function () {
    this.draw = function () {
        console.log("highScore")
    }
};

var Options = function () {
    this.draw = function () {
        console.log("options")
    }
};

var Credits = function () {
    this.draw = function () {
        console.log("credits")
    }
};


var MainMenu = function () {
    menuChoice = Button.noChoice;
    this.active = false;
    this.disable();

    document.getElementById("startGame")
        .addEventListener('click', function () {
            MainMenu.menuChoice = Button.startGame;
        }, false);
    document.getElementById("resumeGame")
        .addEventListener('click', function () {
            MainMenu.menuChoice = Button.resumeGame;
        }, false);
    document.getElementById("exitGame")
        .addEventListener('click', function () {
            MainMenu.menuChoice = Button.exitGame
        }, false);
    document.getElementById("highScore")
        .addEventListener('click', function () {
            MainMenu.menuChoice = Button.highScore
        }, false);
    document.getElementById("options")
        .addEventListener('click', function () {
            MainMenu.menuChoice = Button.options
        }, false);
    document.getElementById("credits")
        .addEventListener('click', function () {
            MainMenu.menuChoice = Button.credits
        }, false);
}

MainMenu.prototype = {
    enable: function () {
        this.active = true;
        utils.setVisibility("menuId", 'block');
    },
    disable: function () {
        this.active = false;
        utils.setVisibility("menuId", 'none');
    }
};

