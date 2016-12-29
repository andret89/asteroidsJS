var GameState = State.extend(
    function GameState(game) {
        State.call(this, game); // Superclass()
        this.game.isStart = true;
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
                this.game.isPaused = true;
                this.game.menuManager.menu.enable();
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