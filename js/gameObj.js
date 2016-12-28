var GameObj = Polygon.extend(
    function GameObj(param) {
        Polygon.call(this, param.points, param.size);
        this.parent = param.parent;
        this.size = param.size || 10;
        this.x = param.x;
        this.y = param.y;
        this.type = "GameObj";
        /**
         * Bounds for the asteroid
         */
        this.maxX = param.parent.width;
        this.maxY = param.parent.height;
        // scale the asteroid to the specified size
        this.scale(this.size);

    }, {
        /**
         * Translate and rotate the asteroid
         */
        update: function() {
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
            this.rotate(this.angle);
        },
        /**
         * Draw the polygon with an augmented drawing context
         * 
         * @param  {context2d} ctx augmented drawing conext
         */
        draw: function(g) {
            g.drawPolygon(this, this.x, this.y);
        },
        toString: function() {
            return (this.type + ": " +
                this.x + ", " + this.y + ", " + this.size);
        },
        /**
         * Useful point in polygon check, taken from:
         * 
         * @param  {number}  x test x coordinate
         * @param  {number}  y test y coordinate
         * @return {Boolean}   result from check
         * 
         * @override Polygon.hasPoint
         */
        isContains: function(x, y) {
            var c = Math.cos(this.angle);
            var s = Math.sin(this.angle);
            var xc = c * x - s * y, yc= s * x + c * y;

            return this.isContainsPoint({x:this.x, y:this.y}, {x:xc, y:yc});
        }
    }
)