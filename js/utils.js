/**
 * Wrapper around window.requestAnimationFrame (rAF)
 *
 * @param  {function} callback the function to animate
 */
// handle multiple browsers for requestAnimationFrame()
window.requestAnimFrame = (function (callback) {

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function log(s) {
    console.log(s + '')
}

var utils = {
    isUndefined: function (obj,s) {
        var ret = obj === void 0 || obj === null;
        if(ret)
            log(s +" undefined");
        return ret
    },
    isUndifinedParam: function (param) {
        for (key in param) {
            if (param[key] !== 0) {
                if (utils.isUndefined(param[key],key)) {
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


var Inputs = {
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false,
        space: false
    },
    mousePos: {
        x: 0,
        y: 0
    },
    keyMap: {
        68: 'right',
        65: 'left',
        87: 'up',
        83: 'down',
        32: 'space'
    }
}

function keydown(event) {
    var key = Inputs.keyMap[event.keyCode];
    Inputs.pressedKeys[key] = true
}

function keyup(event) {
    var key = Inputs.keyMap[event.keyCode];
    Inputs.pressedKeys[key] = false
}

function getPosMouse(event) {
    Inputs.mousePos.x = event.clientX
    Inputs.mousePos.y = event.clientY
    //console.log(Inputs.mousePos.x + ', ' + Inputs.mousePos.y)
}

window.addEventListener("keydown", keydown, false)
window.addEventListener("keyup", keyup, false)
window.addEventListener("mouseup", getPosMouse, false)
window.addEventListener("mousemove", getPosMouse, false)