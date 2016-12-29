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
        inputManager: function (input) {
            if(input.isPressed('KEY_ESC')){
                log("esc")
                this.game.nextState = States.MENU;
            }

        },
        update: function () {
            this.aster.update()

        },
        render: function (g) {
            g.clearAll()
            this.aster.draw(g)

        }
    });