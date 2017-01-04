var Bullet = function Bullet(param) {
    this.type = "Bullet";
    this.color = "yellow";
    this.x = param.x;
    this.y = param.y;
    this.parent = param.parent;
    this.maxX = param.parent.width;
    this.maxY = param.parent.height;
    this.active = true;

    // set velocity according to angle param
    var v = 45;
    this.vel = {
        x: v * Math.cos(param.angle),
        y: v * Math.sin(param.angle)
    }
}
Bullet.prototype = {
    /**
     * Update position of bullet
     */
    update:function(dt) {
        // saves previous position, used when rendering
        this.oldx = this.x;
        this.oldy = this.y;

// inside bounds check
        if (0 > this.x || this.x > this.maxX ||
            0 > this.y || this.y > this.maxY
        ) {
            this.active = false;
        }

// translate position
        this.x += this.vel.x * dt;
        this.y += this.vel.y * dt;
    },

    /**
     * Draw the bullet to an augmented drawing context
     * 
     * @param  {Canvas} g agumented drawing context
     */
    draw: function(g) {
        g.drawLine(this.oldx, this.oldy, this.x, this.y, this.color)
    }
}