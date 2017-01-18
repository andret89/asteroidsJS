/**
 * Emunarizone dei codice e corrispondenti comandi
 * @type {{KEY_LEFT: number, KEY_RIGHT: number, KEY_UP: number, KEY_DOWN: number, KEY_ENTER: number, KEY_ESC: number, KEY_CTRL: number, KEY_SPACE: number, KEY_W: number, KEY_A: number, KEY_S: number, KEY_D: number, KEY_P: number, KEY_M: number, KEY_G: number}}
 */
var Key = {
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    KEY_UP: 38,
    KEY_DOWN: 40,
    KEY_ENTER: 13,
    KEY_ESC: 27,
    KEY_CTRL: 17,
    KEY_SPACE: 32,
    KEY_W: 87,
    KEY_A: 65,
    KEY_S: 83,
    KEY_D: 68,
    KEY_P: 80,
    KEY_M: 77,
    KEY_G: 71
};

/**
 * @lass Rappresenta il gestore di comandi della keyboard e del mouse
 * @constructor
 */
var Inputs = function() {
    this.keys = {};
    this.down = {};
    this.pressed = {};
    // initiate private fields
    for (var i in Key) {
        var code = Key[i];
        this.keys[code] = i;
        this.down[i] = false;
        this.pressed[i] = false;
    }
}
Inputs.prototype = {
    /**
     * registrazione hendler per i bottoni selezionati
     */
    init: function() {
        var self = this;

        // add eventlisteners to monitor presses
        document.addEventListener("keydown", function(evt) {
            self.down[self.keys[evt.keyCode]] = true;
        });
        document.addEventListener("keyup", function(evt) {
            self.down[self.keys[evt.keyCode]] = false;
            self.pressed[self.keys[evt.keyCode]] = false;
        });

        document.addEventListener("mousedown", function(evt) {
            self.down['KEY_SPACE'] = true;
        });
        document.addEventListener('mouseup', function(evt) {
            self.down['KEY_SPACE'] = false;
            self.pressed['KEY_SPACE'] = false;

        });

    },
    /**
     * Tells if a monitored key is hold down
     *
     * @param  {string}  key name of monitored key
     * @return {Boolean}     result from check
     */
    isDown: function(key) {
        return this.down[key];
    },

    /**
     * Tells if a monitored key is pressed, returns true first time
     * the key is pressed
     *
     * @param  {string}  key name of monitored key
     * @return {Boolean}     result from check
     */
    isPressed: function(key) {
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
var SoundManager = function() {
    this.sounds = [];
};
SoundManager.prototype = {
    /**
     *
     * @param {String} url - path del file
     * @param {String} key - chiave associato
     */
    loadSound: function(url, key) {
        var s = new Audio(url);
        if (key === 'shield' && key === 'fire')
            s.volume = .06;
        this.sounds[key] = s;
    },
    /**
     *
     * @param type
     */
    stopSound: function(type) {
        var s = this.sounds[type];
        s.pause();
        s.currentTime = 0;

    },
    /**
     *
     * @param type
     */
    playSound: function(type) {
        if (Main.MUTE)
            return;

        var s = this.sounds[type];
        if (type !== 'fire') {
            s.load();
        }
        s.play();
    }
};