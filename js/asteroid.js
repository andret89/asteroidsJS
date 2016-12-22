/**
 * Asteroid
 * Asteroid class, extends Polygon see polygon.js
 * 
 * @param  {Array<number>} p list of verticies
 * @param  {number}        s scalefactor, size of asteroid
 * @param  {number}        x start x coordinate
 * @param  {number}        y start y coordinate
 */
var Asteroid = GameObj.extend(
    // constructor
    function Asteroid(arguments) {
        GameObj.call(this, arguments.points, arguments.size); // Superclass()
        this.type = "Asteroid";
        this.color = "white";

        utils.isNaNparam(this)
    }, {
       }
);

    

/**
 * Ship
 * Ship class, extends Polygon see polygon.js
 * 
 * @param  {Array<number>} p list of verticies
 * @param  {number}        s scalefactor, size of asteroid
 * @param  {number}        x start x coordinate
 * @param  {number}        y start y coordinate
 */

function Shipl(p, s, x, y) {
    /**
     * Bounds for the asteroid
     */
    maxX = null;
    maxY = null;
    Polygon.call(this, p);
    this.type = "Ship";
    this.color = "white";

    // position vars
    this.x = x;
    this.y = y;
}