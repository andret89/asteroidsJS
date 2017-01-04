/**
 * Created by andre on 28/12/16.
 */
var StartInfo = function(main){
        this.main = main;
}
StartInfo.prototype = {
        update: function (input,dt) {
            if(this.main.menu.active)
                return;

            if (input.isPressed('KEY_SPACE') || input.isPressed('KEY_ENTER')) {
                    log("start");
                    this.main.menu.enable();
                    return;
            }

        },
        draw: function (g) {
            var ga = g.ctx
            ga.fillStyle = "yellow";
            ga.font = "30px sans-serif";
            var s = "ASTEROIDS GAME \n\n\n usare wasd o mouse per muoversi \n\n spazio per missili";
            g.fillTextMultiLine(s, g.canvas.width / 2 - (s.length + 140), 100);
        }
}

