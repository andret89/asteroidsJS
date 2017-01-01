/**
 * Created by andre on 28/12/16.
 */
var GameOverState = State.extend(
    function GameOverState(game) {
        this.game = game;
    },
    {
        inputManager: function (input) {
            if(input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')){;
                //this.game.isPaused = true;
                this.game.menuManager.menu.enable();
            }
        },
        update: function () {

        },
        render: function (g) {
            g.clearAll()
            var ga = g.ctx;
            if(this.gameOver){
                ga.fillStyle = "yellow";
                ga.font = "50px sans-serif";
                var s ="GAME OVER\n\npush spacebar";
                g.fillTextMultiLine(s,g.canvas.width/2-(s.length+100),100, g.canvas.height/2-20);
            }
        }
    });

