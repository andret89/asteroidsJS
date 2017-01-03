/**
 * Asteroid
 * Asteroid class, extends Polygon see polygon.js
 *
 * @param  {Array<number>} points list of verticies
 * @param  {number}        size scalefactor, size of asteroid
 * @param  {number}        x start x coordinate
 * @param  {number}        y start y coordinate
 * @param  {Canvas}        parent window parent

 */
var Asteroid = GameObj.extend(
    // constructor
    function Asteroid(arguments) {
        arguments.points = Points.ASTEROIDS[arguments.typeAster];
        GameObj.call(this, arguments); // Superclass()
        this.type = "Asteroid";
        this.color = "grey";
        this.active = true;
        this.img = new Image();
        this.img.src = "img/aster.png";
        this.radius = this.size*4;
        // Set rotation angle used in each update
        this.rotation = 0.02 * (Math.random() * 2 - 1);
        this.angle = this.rotation;

        // Generate and calculate velocity
        var r = Math.PI * Math.random();
        var v = Math.random() + 1;
        this.vel = {
            x: v * Math.cos(r),
            y: v * Math.sin(r)
        }
    }, {
        /**
         * Translate and rotate the asteroid
         */
        update: function () {
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
            this.angle += this.rotation;
        },
        /**
         * Draw the polygon with an augmented drawing context
         *
         * @param  {context2d} ctx augmented drawing conext
         */
        draw: function (g) {
            g.drawAster(this, this.x, this.y);
            if(DEBUG_BOX) {
                g.drawCircleBox(this.x,this.y,this.radius);
            }
        },
        isCollision: function (x,y) {
            return this.collisionCircle(x,y);
        }
    }
);