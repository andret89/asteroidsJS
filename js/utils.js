function log(s) {
    console.log(s + '')
}

var utils = {
    isUndefined: function(obj, s) {
        var ret = obj === void 0 || obj === null;
        if (ret)
            if (DEBUG)
                log(s + " undefined");
        return ret
    },
    isUndifinedParam: function(param) {
        for (key in param) {
            if (param[key] !== 0) {
                if (utils.isUndefined(param[key], key)) {
                    return true;
                }
            }
        }
        return false;
    }
}

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