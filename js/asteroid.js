/**
 * Asteroid
 * Asteroid class, extends Polygon see polygon.js
 * 
 * @param  {Array<number>} points list of verticies
 * @param  {number}        size scalefactor, size of asteroid
 * @param  {number}        x start x coordinate
 * @param  {number}        y start y coordinate
 */
var Asteroid = GameObj.extend(
    // constructor
    function Asteroid(arguments) {
        GameObj.call(this, arguments); // Superclass()
        this.type = "Asteroid";
        this.color = "white";
        this.active = true
        utils.isNaNparam(this)
    }, {
        collisionBullet: function(bullet) {
            if (utils.isUndefined(bullet))
                return false;
            var p = [],
                b = bullet;

            p[0] = ({ x: b.x - this.x, y: b.y - this.y })
            p[1] = ({ x: b.prevx - this.x, y: b.prevy - this.y });
            for (var i = 0; i < p.length; i++) {
                var point = p[i]
                if (this.isContainsPoint(point))
                    return true;
            }
            return false;
        }
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