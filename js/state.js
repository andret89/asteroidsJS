var State = function(game) {
    this.game = game;

    State.prototype = {
        inputManager: function () {

        },
        update: function () {

        },
        render: function (g) {

        }
    }
}

var States = {
    NO_CHANGE: 0,
    MENU: 1,
    GAME: 2,
    GAMEOVER: 3
}