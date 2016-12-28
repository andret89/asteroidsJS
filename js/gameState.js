var GameState = State.extend(
    function GameState(game) {
        State.call(this, game); // Superclass()
        this.aster = new Asteroid({
            size: 10,
            x: 200,
            y: 200,
            typeAster: 0,
            parent: game.screen
        })
    }, {
        inputManager: function () {

        },
        update: function () {
            this.aster.update()
            var x=Inputs.mousePos.x-this.game.screen.canvas.offsetLeft,
                y=Inputs.mousePos.y-this.game.screen.canvas.offsetTop;
            if (this.aster.isContains(x,y)) {
                this.aster.color = "red"
            }
            else
                this.aster.color = "green"
        },
        render: function (g) {
            g.clearAll()
            var x=Inputs.mousePos.x-this.game.screen.canvas.offsetLeft,
                y=Inputs.mousePos.y-this.game.screen.canvas.offsetTop;

            g.drawCircle({center:{x:x,y:y},color:"yellow",radius:2},0,0)
            this.aster.draw(g)

        }
    });