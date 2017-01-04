/**
 * Created by andre on 03/01/17.
 */
var Button = {
    startGame: 0,
    resumeGame: 1,
    exitGame: 2,
    noChoice: 3
};

var Menu = function (main) {
    menuChoice = Button.noChoice;
    this.main = main;
    this.disable();

    document.getElementById("startGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.startGame;
        }, false);
    document.getElementById("resumeGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.resumeGame;
        }, false);
    document.getElementById("exitGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.exitGame
        }, false);
};

Menu.prototype = {
    setVisibility: function (id, value) {
        document.getElementById(id).style.display = value;
    },
    enable: function () {
        this.active = true;
        this.main.paused = true;
        this.setVisibility("menuId", 'block');
    },
    disable: function () {
        this.active = false;
        this.main.paused = false;
        this.setVisibility("menuId", 'none');
    },
    update: function (input) {
        if(!this.active)
            return;

        if (input.isPressed('KEY_ESC') || input.isPressed('KEY_P')) {
            if(Main.startGame) {
                log("pause");
                Menu.menuChoice = Button.resumeGame;
            }
        }
        switch (Menu.menuChoice) {
            case Button.startGame:
                console.log("startGame");
                this.setVisibility("startGame", 'none');
                this.setVisibility("resumeGame", 'block');
                this.disable();
                this.main.nextState = States.GAME;
                break;
            case Button.resumeGame:
                console.log("resumeGame");
                this.disable();
                break;
            case Button.exitGame:
                if (Main.startGame) {
                    console.log("exitGame");
                    this.setVisibility("resumeGame", 'none');
                    this.setVisibility("startGame", 'block');
                    this.main.nextState = States.GAMEOVER;
                    this.disable();
                }else
                    if(Main.endGame){
                        this.setVisibility("resumeGame", 'none');
                        this.setVisibility("startGame", 'block');
                        this.main.nextState = States.INFO;
                    this.disable();
                }
                break;
        }
        Menu.menuChoice = Button.noChoice;

    }
};
