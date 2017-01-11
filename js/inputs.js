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


var Inputs = function() {
    this.mousePos = { x: 0, y: 0 };
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
    init: function(main) {
        var self = this;
        self.main = main;

        // add eventlisteners to monitor presses
        document.addEventListener("keydown", function(evt) {
            self.down[self.keys[evt.keyCode]] = true;
        });
        document.addEventListener("keyup", function(evt) {
            self.down[self.keys[evt.keyCode]] = false;
            self.pressed[self.keys[evt.keyCode]] = false;
        });
        document.addEventListener("mousemove", function(event) {
            self.mousePos.x = event.clientX;
            self.mousePos.y = event.clientY;
            if (MOUSE_GAME && Main.paused === false &&
                self.main.currState.player !== void 0) {
                var player = self.main.currState.player;
                var dx = (self.mousePos.x - player.x);
                var dy = (self.mousePos.y - player.y);
                var angle = Math.atan2(dy, dx); //+ toRadians(90
                player.angle = angle;
            }
        });
        document.addEventListener("mousedown", function(evt) {
            self.down['KEY_SPACE'] = true;
        });
        document.addEventListener('mouseup', function(evt) {
            self.down['KEY_SPACE'] = false;
            self.pressed['KEY_SPACE'] = false;

        });


        /**
         * Tells if a monitored key is hold down
         *
         * @param  {string}  key name of monitored key
         * @return {Boolean}     result from check
         */
    },
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