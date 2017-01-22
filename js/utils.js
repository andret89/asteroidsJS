function log(s) {
    console.log(s + '')
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
Math.randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
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

Function.prototype.extend = function(constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
};

Array.prototype.forEachOptimized = function (a) {
    var l = this.length;
    for (var i = 0; i < l; i++)
        a(this[i], i)
};