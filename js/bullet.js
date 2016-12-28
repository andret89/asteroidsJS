var Bullet = function Bullet(param) {
    this.type = "Bullet";
    this.color = "yellow";
    this.x = param.x;
    this.y = param.y;
    this.size = param.size;
    this.angle = param.angle;
    this.parent = param.parent;
    this.maxX = param.parent.width;
    this.maxY = param.parent.height;
    this.active = true

    // set velocity according to angle param
    this.vel = {
        x: 3 * Math.cos(this.angle),
        y: 3 * Math.sin(this.angle)
    }
    utils.isNaNparam(this)
    this.active = true;
}
Bullet.prototype = {
    toString: function() {
        return this.type + " center " + this.x + ", " + this.y;
    },
    /**
     * Update position of bullet
     */
    update: function() {

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
        // saves previous position, used when rendering
        this.prevx = this.x;
        this.prevy = this.y;

        /* inside bounds check
        if (0 > this.x || this.x > this.maxX ||
            0 > this.y || this.y > this.maxY
        ) {
            this.active = false;
        }
        */

        // translate position
        this.x += this.vel.x + this.size;
        this.y += this.vel.y + this.size;
    },

    /**
     * Draw the bullet to an augmented drawing context
     * 
     * @param  {Canvas} g agumented drawing context
     */
    draw: function(g) {
        g.drawLine(this.prevx, this.prevy, this.x, this.y, this.color)
    }
}