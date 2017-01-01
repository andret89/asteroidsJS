/**
 * Wrapper around window.requestAnimationFrame (rAF)
 *
 * @param  {function} callback the function to animate
 */
// handle multiple browsers for requestAnimationFrame()
window.requestAnimFrame = (function (callback) {

    return window.requestAnimationFrame     ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||

        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function log(s) {
    console.log(s + '')
}

var utils = {
    isUndefined: function (obj, s) {
        var ret = obj === void 0 || obj === null;
        if (ret)
            log(s + " undefined");
        return ret
    },
    isUndifinedParam: function (param) {
        for (key in param) {
            if (param[key] !== 0) {
                if (utils.isUndefined(param[key], key)) {
                    return true;
                }
            }
        }
        return false;
    },
    colisionCircle: function (c1, c2) {
        return utils.distance(c1.center, c2.center) < c1.radius + c2.radius;
    },
    distance: function (ent1, ent2) {
        var dx = ent2.x - ent1.x;
        var dy = ent2.y - ent1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    distaceCircle: function (c1, c2) {
        return utils.distace(c1.center, c2.center);
    },
    setVisibility: function (id, value) {
        document.getElementById(id).style.display = value;
    }
}

// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

function defineSubclass(superclass, // Constructor of our superclass
                        constructor, // Constructor of our new subclass
                        methods, // Instance methods
                        statics) { // Class properties
    // Set up the prototype object of the subclass
    constructor.prototype = Object.create(superclass.prototype);
    constructor.prototype.constructor = constructor;

    function eredita(o, p) {
        for (var prop in p) {
            o[prop] = p[prop];
        }
        return o;
    }

    if (methods) eredita(constructor.prototype, methods);
    if (statics) eredita(constructor, statics);
    return constructor;
}

Function.prototype.extend = function (constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
};

var Key = {
    KEY_LEFT:   37,
    KEY_RIGHT:  39,
    KEY_UP:     38,
    KEY_DOWN:   40,
    KEY_ENTER:  13,
    KEY_ESC:    27,
    KEY_CTRL:   17,
    KEY_SPACE:  32,
    KEY_W:      87,
    KEY_A:      65,
    KEY_S:      83,
    KEY_D:      68,
    KEY_P:      80
};


var Inputs = function(game) {
    this.game = game;
    this.mousePos = {x: 0, y: 0};
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
Inputs.prototype ={
    init:function () {
        var self = this;

// add eventlisteners to monitor presses
        document.addEventListener("keydown", function (evt) {
                self.down[self.keys[evt.keyCode]] = true;
        });
        document.addEventListener("keyup", function (evt) {
                self.down[self.keys[evt.keyCode]] = false;
                self.pressed[self.keys[evt.keyCode]] = false;
                log("keyup")
        });
        document.addEventListener("mousemove", function (event) {

            self.mousePos.x = event.clientX;
            self.mousePos.y = event.clientY;
            if(MOUSE_GAME && self.game.currState instanceof GameState) {
                var gameCurr = self.game.currState;
                var dx = (self.mousePos.x - gameCurr.player.x);
                var dy = (self.mousePos.y - gameCurr.player.y);
                var angle = Math.atan2(dy, dx); //+ toRadians(90
                gameCurr.player.angle = angle;
/*
                if(gameCurr.player.angle-angle !==0 ) {
                    gameCurr.player.addDirection(gameCurr.player.angle - angle);
                    gameCurr.player.angle = angle
                }
*/                    // if(gameCurr.player.angle-angle !==0 ) {
                //     if(dx > 0)
                //         gameCurr.player.addDirection(-gameCurr.player.angle + angle);
                //     else
                //         gameCurr.player.addDirection(gameCurr.player.angle - angle);
                //
                //     gameCurr.player.angle = angle


            }
            //console.log(Inputs.mousePos.x + ', ' + Inputs.mousePos.y)
        });
        document.addEventListener("mousedown", function (evt) {
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
    isDown : function (key) {
        return this.down[key];
    },

    /**
     * Tells if a monitored key is pressed, returns true first time
     * the key is pressed
     *
     * @param  {string}  key name of monitored key
     * @return {Boolean}     result from check
     */
    isPressed : function (key) {
        if (this.pressed[key]) {
            return false;
        } else if (this.down[key]) {
            return this.pressed[key] = true;
        }
        return false;
    }
};