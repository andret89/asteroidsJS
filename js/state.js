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
    update: function(input) {
        if (input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')) {
            this.main.menu.enableOptions();
        }

    },
    draw: function(g) {
        if (this.menu.active || this.menu.activeInfo || this.menu.activeDifficulty) {
            return;
        }
        var ga = g.ctx;
        ga.save();
        ga.fillStyle = "darkgoldenrod";
        ga.font = "80px sans-serif";

        ga.shadowBlur = 8;
        ga.shadowColor = "yellow";
        var x = g.width / 2;
        var y = g.height / 2;

        ga.textAlign = 'center';
        var s = "Asteroids game \n\npush spacebar";
        g.fillTextMultiLine(s, x, y);
        ga.restore();
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
};

GameOver.prototype = {
    update: function(input) {
        if (input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')) {
            this.main.menu.enableOptions();
        }
    },
    draw: function(g) {
        if (this.menu.active || this.menu.activeInfo || this.menu.activeDifficulty) {
            return;
        }
        var ga = g.ctx;
        ga.save();
        ga.shadowBlur = 8;
        ga.shadowColor = "red";
        ga.fillStyle = "red";
        ga.textAlign = "center";
        ga.font = "50px sans-serif";
        var s = "   GAME OVER\n\n  Your Score  " + this.main.score + "\n\n  HighScore  " + this.hs + "\n\n  push spacebar";
        g.fillTextMultiLine(s, g.canvas.width / 2, g.canvas.height / 2 - 80);
        ga.restore();

    }
}