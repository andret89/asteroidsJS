/**
 * Lista dei codice e corrispondenti tasti
 */
var Key = {
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    KEY_UP: 38,
    KEY_DOWN: 40,
    KEY_ENTER: 13,
    KEY_ESC: 27,
    KEY_CTRL: 17,
    KEY_ALT:18,
    KEY_SPACE: 32,
    KEY_W: 87,
    KEY_A: 65,
    KEY_S: 83,
    KEY_D: 68,
    KEY_P: 80,
    KEY_M: 77,
    KEY_G: 71,
    KEY_C: 67
};

/**
 * @lass Rappresenta il gestore di comandi della keyboard e del mouse
 * @constructor
 */
var Inputs = function () {
    this.keys = {};
    this.down = {};
    this.pressed = {};
    this.selectObj = null;
    this.mousePos = {
        x: 0,
        y: 0
    };
    // initiate private fields
    for (var i in Key) {
        var code = Key[i];
        this.keys[code] = i;
        this.down[i] = false;
        this.pressed[i] = false;
    }
};
Inputs.prototype = {
    /**
     * registrazione hendler per i bottoni selezionati
     */
    init: function (main) {
        this.main = main;
        var self = this;

        // add eventlisteners to monitor presses
        document.addEventListener("keydown", function (evt) {
            self.down[self.keys[evt.keyCode]] = true;
        });
        document.addEventListener("keyup", function (evt) {
            self.down[self.keys[evt.keyCode]] = false;
            self.pressed[self.keys[evt.keyCode]] = false;
        });

        document.addEventListener("mousedown", function (evt) {
            var btnCode = evt.button;

            var game = self.main.currState;
            var inGame = game && game instanceof Game;

            switch (btnCode) {
                case 0:
                    if (inGame) {
                        var b = game.bonus;
                        b.forEachOptimized(function (a) {
                           if (a.hitTest(evt.clientX, evt.clientY)) {
                                self.selectObj = a;
                                a.selected = true;
                                log("selected")
                            }
                        })
                    }
                    self.down['KEY_SPACE'] = true;
                    break;

                case 1:
                    console.log('Middle button clicked.');
                    break;

                case 2:

                    self.down['KEY_DOWN'] = true;

                    break;

                default:
                    console.log('Unexpected code: ' + btnCode);
            }

        });
        document.addEventListener('mouseup', function (evt) {
            var btnCode = evt.button;

            switch (btnCode) {
                case 0:
                    if(self.selectObj !== null)
                        self.selectObj.selected = false;

                    self.selectObj = null;
                    self.down['KEY_SPACE'] = false;
                    self.pressed['KEY_SPACE'] = false;
                    break;

                case 1:
                    console.log('Middle button clicked.');
                    break;

                case 2:

                    self.down['KEY_DOWN'] = false;
                    self.pressed['KEY_DOWN'] = false;
                    break;

                default:
                    console.log('Unexpected code: ' + btnCode);
            }

        });

        // gestione evento movimento mouse
        document.addEventListener("mousemove", function (event) {

            // e aggiornamento angolo di rotazione player
            if (Main.MOUSE_GAME && !Main.paused) {
                var game = self.main.currState;
                var inGame = game && game instanceof Game;
                if (inGame) {
                    if (self.selectObj !== null) {
                        self.selectObj.x = event.clientX;
                        self.selectObj.y = event.clientY;
                    }
                    else {
                        var player = game.player;
                        if (game && player) {
                            var dx = (event.clientX - player.x);
                            var dy = (event.clientY - player.y);
                            player.angle = Math.atan2(dy, dx);
                        }
                    }
                }
            }
        });

    },
    /**
     * indica se il tasto richesto è tentuto premuto
     *
     * @param  {string} key - chiave di richiesta
     * @return {Boolean}  Risultato del controllo
     */
    isDown: function (key) {
        return this.down[key];
    },

    /**
     * indica se è stasto premuto un tasto
     *
     * @param  {string} key - chiave di richiesta
     * @return {Boolean}  Risultato del controllo
     */
    isPressed: function (key) {
        if (this.pressed[key]) {
            return false;
        } else if (this.down[key]) {
            return this.pressed[key] = true;
        }
        return false;
    }
};


/**
 * Gestore dei suoni
 * @class
 * @constructor
 */
var SoundManager = function () {
    this.sounds = [];
};
SoundManager.prototype = {
    /**
     *
     * @param {String} url - path del file
     * @param {String} key - chiave associata
     */
    loadSound: function (url, key) {
        var s = new Audio(url);
        if (key === 'shield' && key === 'fire')
            s.volume = .06;
        this.sounds[key] = s;
    },
    /**
     *
     * @param {string} type - chiave di riferimanto audio
     */
    stopSound: function (type) {
        var s = this.sounds[type];
        s.pause();
        s.currentTime = 0;

    },
    /**
     *
     * @param {string} type - chiave di riferimanto audio
     */
    playSound: function (type) {
        if (Main.Mute)
            return;

        var s = this.sounds[type];
        if (type !== 'fire') {
            s.load();
        }
        s.play();
    }
};