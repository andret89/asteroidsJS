/**
 * Wrapper around window.requestAnimationFrame (rAF)
 * 
 * @param  {function} callback the function to animate
 */
// handle multiple browsers for requestAnimationFrame()
window.requestAnimFrame = (function(callback) {

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function log(s) { console.log(s + '') }

var utils = {
    isNaNparam: function(param) {
        for (key in param) {
            var b = param[key] || null;
            if (b === null) {
                console.log(key + " is null")
                return true;
            }
        }
        return false;
    },
    colisionCircle:function(c1,c2) {
      return distance(c1.center,c2.center) < c1.radius + c2.radius;
    },
    distance : function(ent1, ent2) {
        var dx = ent2.x - ent1.x;
        var dy = ent2.y - ent1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }, 
    distaceCircle : function(c1, c2) {
        return distace(c1.center, c2.center);
    }
}

function defineSubclass(superclass, // Constructor of our superclass
    constructor, // Constructor of our new subclass
    methods, // Instance methods
    statics) { // Class properties
    // Set up the prototype object of the subclass
    constructor.prototype = Object.create(superclass.prototype);
    constructor.prototype.constructor = constructor;

    function extend(o, p) {
        for (var prop in p) {
            o[prop] = p[prop];
        }
        return o;
    }
    if (methods) extend(constructor.prototype, methods);
    if (statics) extend(constructor, statics);
    return constructor;
}

Function.prototype.extend = function(constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
};


function Extends(objSub, objSup) {
    //eredita da GameObject
    objSub.prototype = Object.create(objSup.prototype);

    //reimposta il constructor
    objSub.prototype.constructor = objSub;
}

var state = {
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
    }
}

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down',
    32: 'space'
}

function keydown(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
}

function keyup(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

function savePosMouse(event) {
    state.mousePos.x = event.clientX
    state.mousePos.y = event.clientY
    //console.log(state.mousePos.x + ', ' + state.mousePos.y)
}

window.addEventListener("keydown", keydown, false)
window.addEventListener("keyup", keyup, false)
window.addEventListener("mouseup", savePosMouse, false)
