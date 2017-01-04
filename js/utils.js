
function log(s) {
    console.log(s + '')
}

var utils = {
    isUndefined: function (obj, s) {
        var ret = obj === void 0 || obj === null;
        if (ret)
            if(DEBUG)
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
    collisionC: function (c1x, c1y, r1, c2x, c2y, r2) {
        var _r2 = r2 || 0; // 0 per distanza da un punto
        return utils.distance({x:c1x,y:c1y},{x:c2x,y:c2y}) < r1 + _r2;
    },
    distance: function (ent1, ent2) {
        var dx = ent2.x - ent1.x;
        var dy = ent2.y - ent1.y;
        return Math.sqrt(dx * dx + dy * dy);
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


var Inputs = function() {
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
    init:function (main) {
        var self = this;
        self.main = main;

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
            if(MOUSE_GAME && !utils.isUndefined(self.main.game)) {
                var player = self.main.game.player;
                var dx = (self.mousePos.x - player.x);
                var dy = (self.mousePos.y - player.y);
                var angle = Math.atan2(dy, dx); //+ toRadians(90
                player.angle = angle;
            }
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