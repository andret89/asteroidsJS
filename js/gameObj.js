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
        this.radius = this.size * 4;

        // Set rotation angle used in each update
        this.rotAngle = 0.02 * (Math.random() * 2 - 1);

        // Generate and calculate velocity
        var r = 2 * Math.PI * Math.random();
        var v = Math.random() + 1;
        this.vel = {
                x: v * Math.cos(r),
                y: v * Math.sin(r)
            }
            /*    x = min_x + (max_x - min_x)/2,
                  y = min_y + (max_y - min_y)/2 
            */
        var getCenter = function(p) {
            var maxXpoint = 0,
                maxYpoint = 0,
                minXpoint = 1000,
                minYpoint = 1000;
            for (var i = 0; i < p.length; i++) {
                var e = p[i]
                if (maxXpoint < e.x)
                    maxXpoint = e.x;
                if (maxYpoint < e.y)
                    maxYpoint = e.y

                if (minXpoint > e.x)
                    minXpoint = e.x;
                if (minYpoint > e.y)
                    minYpoint = e.y

            }
            return {
                x: (minXpoint + (maxXpoint - minXpoint) / 2),
                y: (minYpoint + (maxYpoint - minYpoint) / 2)
            }
        }
        var c = getCenter(this.points)
        this.center = c;
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
            this.rotate(this.rotAngle);
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
        hasPoint: function(x, y) {
            return this.hasPoint.call(this.x, this.y, x, y);
        }
    }
)