/**
 * Asteroid
 * Asteroid class, extends Polygon see polygon.js
 * 
 * @param  {Array<number>} p list of verticies
 * @param  {number}        s scalefactor, size of asteroid
 * @param  {number}        x start x coordinate
 * @param  {number}        y start y coordinate
 */

function Asteroid(p, s, x, y) {
    /**
     * Bounds for the asteroid
     */
    maxX = null;
    maxY = null;
    Polygon.call(this, p);
    this.type = "Asteroid";
    this.color = "white";

    // position vars
    this.x = x;
    this.y = y;

    // scale the asteroid to the specified size
    this.size = s;
    this.scale(s);

    // Set rotation angle used in each update
    this.rotAngle = 0.02 * (Math.random() * 2 - 1);

    // Generate and calculate velocity
    var r = 2 * Math.PI * Math.random();
    var v = Math.random() + 1;
    this.vel = {
        x: v * Math.cos(r),
        y: v * Math.sin(r)
    }
    this.toString = function() {
            return (this.type + ": " +
                this.x + ", " + this.y + ", " + this.size);
        }
        /**
         * Draw the asteroid with an augmented drawing context
         * 
         * @param  {context2d} ctx augmented drawing conext
         */
    this.draw = function(ca) {
            ca.clearAll();
            ca.drawPolygon(this, this.x, this.y);
        }
        /**
         * Translate and rotate the asteroid
         */
    this.update = function() {
            // update position
            this.x += this.vel.x;
            this.y += this.vel.y;

            // keep within bounds
            if (this.x > this.maxX) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = this.maxX;
            }
            if (this.y > this.maxY) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = this.maxY;
            }
            // rotate asteroids 
            this.rotate(this.rotAngle);
        }
        /**
         * Useful point in polygon check, taken from:
         * 
         * @param  {number}  x test x coordinate
         * @param  {number}  y test y coordinate
         * @return {Boolean}   result from check
         * 
         * @override Polygon.hasPoint
         */
    this.hasPoint = function(x, y) {
        return this.prototype.hasPoint(this.x, this.y, x, y);
    }
}

Extends(Polygon, Asteroid);