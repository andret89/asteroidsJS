/**
 *
 * @class Rappresenta lo stato di inizio
 * @param {Main} main - controllo principale
 * @constructor
 */
var Start = function(main) {
    this.type = "Start";
    this.main = main;
    this.menu = main.menu;

}
Start.prototype = {
    update: function (input) {
        if (input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')) {
            this.main.menu.enableOptions();
        }

    },
    draw: function (g) {
        if (this.menu.active || this.menu.activeInfo || this.menu.activeDifficultly) {
            return;
        }
        var ga = g.ctx;
        ga.fillStyle = "darkgoldenrod";
        ga.font = "80px sans-serif";
       /* ga.shadowOffsetX = 2;
        ga.shadowOffsetY = 2;
        ga.shadowBlur = 25;
        ga.shadowColor = "green";
       */
        var s = "Asteroids game \n\npush spacebar";
        g.fillTextMultiLine(s, g.canvas.width / 4  + 150, g.canvas.height / 2 - 80);
    }
};

/**
 * @class Rappresenta lo stato finale del gioco
 * @param {Main} game - controllo principale
 * @constructor
 */
var GameOver = function(game) {
    this.type = "GameOver";
    this.main = game;
    this.menu = game.menu;
    this.hs = this.main.saveScore(this.main.score);
}
GameOver.prototype = {
    /**
     *
     * @param input
     */
    update: function(input) {
        if (input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')) {
            this.main.menu.enableOptions();
            return;
        }
    },
    /**
     *
     * @param g
     */
    draw: function(g) {
        if (this.menu.active || this.menu.activeInfo || this.menu.activeDifficultly) {
            return;
        }
        var ga = g.ctx;
        ga.fillStyle = "red";
        ga.font = "50px sans-serif";
        var s = "   GAME OVER\n\n HighScore  " + this.hs + "\n\n  push spacebar";
        g.fillTextMultiLine(s, g.canvas.width / 2 - (s.length + 130), g.canvas.height / 2 - 80);

    }
}