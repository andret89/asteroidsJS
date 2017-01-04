/**
 * Created by andre on 28/12/16.
 */
var GameOver = function (game) {
    this.main = game;
    this.hs = this.main.saveScore(this.main.score);
}
GameOver.prototype =
    {
        update: function (input) {
            if(this.main.menu.active)
                return;

            if (input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')) {
                this.main.menu.enable();
                return;
            }
        },
        draw: function (g) {
            var ga = g.ctx;
            ga.fillStyle = "red";
            ga.font = "50px sans-serif";
            var s = "   GAME OVER\n\n HighScore  " + this.hs + "\n\n  push spacebar";
            g.fillTextMultiLine(s, g.canvas.width / 2 - (s.length + 130), g.canvas.height / 2 - 80);

        }
    }

