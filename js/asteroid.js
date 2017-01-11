/**
 * Asteroid
 * Asteroid class, extends GameObj
 *
 * @param  {number}        size scalefactor, size of asteroid
 * @param  {number}        x start x coordinate
 * @param  {number}        y start y coordinate
 * @param  {Canvas}        parent window parent

 */
var Asteroid = GameObj.extend(
    // constructor
    function Asteroid(param) {
        GameObj.call(this, param); // Superclass()
        this.type = "Asteroid";
        this.color = "grey";
        this.img = new Image();
        this.img.src = "img/aster.png";
        // Set rotation angle used in each update
        this.rotation = 0.02 * (Math.random() * 2 - 1);
        this.angle = this.rotation;

        // Generate and calculate velocity
        var r = Math.PI * Math.random();
        var v = (Math.random() * 14 )+6;
        var vx = v;
        var vy = v;

        if(Math.random() > 0.5)
            vx *= -1;

        if(Math.random() > 0.5)
            vy *= -1;

        this.vel = {
            x: vx * Math.cos(r),
            y: vy * Math.sin(r)
        };
    }, {
        /**
         * update position with translate and rotate
         */
        update: function(dt) {
            //update for resize
            if (this.maxX !== this.parent.width)
                this.maxX = this.parent.width;
            if (this.maxY !== this.parent.height)
                this.maxY = this.parent.height;

            // update position
            this.x += this.vel.x * dt;
            this.y += this.vel.y * dt;

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
         * Draw the asteroid with an augmented drawing context
         *
         * @param  {context2d} g augmented drawing conext
         */
        draw: function(g) {
            g.drawAster(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                g.drawCircleBox(this.x, this.y, this.radius);
            }
        },
        isCollision: function(x, y) {
            return this.collisionCircle(x, y);
        }
    }
);