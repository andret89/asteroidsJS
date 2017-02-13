function log(s) {
    console.log(s + '')
}

/**
 * Returns a random integer between min and max
 */
Math.randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Converts from degrees to radians.
 */
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

/**
 * Converts from radians to degrees.
 */
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

Function.prototype.extend = function(
    constructor, // costruttore della sottoclasse
    methods, // Instance methods
    statics) { // Class properties
    // Set up the prototype object of the subclass
    var superclass = this; // costruttore della superclasse

    constructor.prototype = Object.create(superclass.prototype);
    constructor.prototype.constructor = constructor;

    var ereditaProprieta = function(o, p) {
        for (var prop in p) {
            o[prop] = p[prop];
        }
        return o;
    }

    if (methods) ereditaProprieta(constructor.prototype, methods);
    if (statics) ereditaProprieta(constructor, statics);
    return constructor;
};

Array.prototype.forEachOptimized = function(a) {
    var l = this.length;
    for (var i = 0; i < l; i++)
        a(this[i], i)
};