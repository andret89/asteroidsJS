/**
 * Tipo di bottone scelto
 */
var Button = {
    startGame: 0,
    resumeGame: 1,
    infoGame: 2,
    exitGame: 3,
    noChoice: 4
};

/**
 * Menu Oggetto, gestore dei bottoni del menu
 *
 * @param {Main} main - controllo principale
 * @constructor
 */
var Menu = function (main) {
    menuChoice = Button.noChoice;
    this.main = main;
    this.disable();
    this.enableInfo();

    document.getElementById("startGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.startGame;
        }, false);
    document.getElementById("resumeGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.resumeGame;
        }, false);
    document.getElementById("infoGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.infoGame;
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
        Main.paused = true;
        this.setVisibility("menuId", 'block');
    },
    disable: function () {
        this.active = false;
        Main.paused = false;
        this.setVisibility("menuId", 'none');
    },
    enableInfo: function () {
        this.activeInfo = true;
        Main.paused = true;
        this.setVisibility("info", 'block');
    },
    disableInfo: function () {
        this.activeInfo = false;
        this.setVisibility("info", 'none');
    },
    update: function (input) {
        if(!this.active && !this.activeInfo)
            return;

        if(this.activeInfo){
            if (input.isPressed('KEY_SPACE')){
                this.disableInfo();
                this.enable();
                return;
            }
        }

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
            case Button.infoGame:
                console.log("infoGame");
                this.disable();
                this.enableInfo();
                break;
            case Button.exitGame:
                console.log("exitGame");
                this.setVisibility("resumeGame", 'none');
                this.setVisibility("startGame", 'block');

                if (Main.startGame) {
                    this.main.nextState = States.GAMEOVER;
                    this.disable();
                }
                break;
        }
        Menu.menuChoice = Button.noChoice;

    }
};
