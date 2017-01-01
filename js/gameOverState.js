/**
 * Created by andre on 28/12/16.
 */
var GameOverState = State.extend(
    function GameOverState(game) {
        this.game = game;
        this.hs = this.game.saveState(this.game.score);
    },
    {
        inputManager: function (input) {
            if(input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')){
                this.game.isPaused = true;
                this.game.isStart = false;
                this.game.menuManager.menu.enable();
            }
        },
        update: function () {

        },
        render: function (g) {
            g.clearAll()
            var ga = g.ctx;
            ga.fillStyle = "red";
            ga.font = "50px sans-serif";
            var s ="   GAME OVER\n\n HighScore  "+this.hs+"\n\n  push spacebar";
            g.fillTextMultiLine(s,g.canvas.width/2-(s.length+130), g.canvas.height/2-80);

        }
    });

