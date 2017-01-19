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
 * @class Gestore dei bottoni del menu
 * @param {Main} main - controllo principale
 * @constructor
 */
var Menu = function (main) {
    menuChoice = Button.noChoice;
    this.main = main;
    this.disableOptions();
    this.disableInfo();
    this.disableDifficultly();
    var self = this;
    Main.paused = false;

    document.getElementById("startGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.startGame;
        }, false);
    document.getElementById("resumeGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.resumeGame;
        }, false);
    document.getElementById("difficultly")
        .addEventListener('click', function () {
            self.enableDifficultly();
            self.disableOptions();
        }, false);
    document.getElementById("infoGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.infoGame;
        }, false);
    document.getElementById("exitGame")
        .addEventListener('click', function () {
            Menu.menuChoice = Button.exitGame
        }, false);

    document.getElementById("easy")
        .addEventListener('click', function () {
            self.main.levelDifficulty = 1;
            self.disableDifficultly();
            self.enableOptions();

        }, false);
    document.getElementById("normal")
        .addEventListener('click', function () {
            self.main.levelDifficulty = 2;
            self.disableDifficultly();
            self.enableOptions();

        }, false);
    document.getElementById("hard")
        .addEventListener('click', function () {
            self.main.levelDifficulty = 3;
            self.disableDifficultly();
            self.enableOptions();
        }, false);
};

Menu.prototype = {
    /**
     *
     * @param id
     * @param value
     */
    setVisibility: function (id, value) {
        document.getElementById(id).style.display = value;
    },
    /**
     *
     */
    enableOptions: function () {
        this.active = true;
        Main.paused = true;
        this.setVisibility("optionsContainer", 'block');

    },
    /**
     *
     */
    disableOptions: function () {
        this.active = false;
        this.setVisibility("optionsContainer", 'none');
    },
    /**
     *
     */
    enableInfo: function () {
        this.activeInfo = true;
        Main.paused = true;
        this.setVisibility("infoContainer", 'block');
    },
    /**
     *
     */
    disableInfo: function () {
        this.activeInfo = false;
        this.setVisibility("infoContainer", 'none');
    },
    /**
     *
     */
    enableDifficultly: function () {
        this.activeDifficultly = true;
        Main.paused = true;
        this.setVisibility("difficultyContainer", 'flex');
    },
    /**
     *
     */
    disableDifficultly: function () {
        this.activeDifficultly = false;
        this.setVisibility("difficultyContainer", 'none');
    },
    /**
     *
     * @param input
     */
    update: function (input) {
        if(!this.active && !this.activeInfo)
            return;

        if(this.activeInfo){
            if (input.isPressed('KEY_SPACE')){
                this.disableInfo();
                this.enableOptions();
                return;
            }
        }

        if (input.isPressed('KEY_ESC') || input.isPressed('KEY_P')) {
            if(Main.startGame) {
                Menu.menuChoice = Button.resumeGame;
            }
        }
        switch (Menu.menuChoice) {
            case Button.startGame:
                this.setVisibility("startGame", 'none');
                this.setVisibility("resumeGame", 'block');
                this.disableOptions();
                Main.paused = false;
                this.main.nextState = States.GAME;
                break;
            case Button.resumeGame:
                this.disableOptions();
                Main.paused = false;
                break;
            case Button.infoGame:
                this.disableOptions();
                this.enableInfo();
                break;
            case Button.exitGame:
                this.setVisibility("resumeGame", 'none');
                this.setVisibility("startGame", 'block');

                if (Main.startGame) {
                    this.main.nextState = States.GAMEOVER;
                    this.disableOptions();
                }
                break;
        }
        Menu.menuChoice = Button.noChoice;

    }
};
