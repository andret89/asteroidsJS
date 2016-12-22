/**
 * Polygon
 * Polygon class, simple polygon class with method as rotation and
 * scaling
 * 
 * @param  {Array<number>} points list of verticies
 * @param  {number} size of polygon
 */
function Polygon(points, size) {
    this.type = "Polygon";
    this.points = [];
    this.size = size || 0;
    for (var i = 0; i < points.length - 1; i += 2)
            points.push({ x: points[i] + size, y: points[i + 1] + size });
}
Polygon.prototype = {
    toString :function() {
            return (this.type + ": " + p);
        }
        /**
         * Rotate the polygon clockwise
         * 
         * @param  {number} theta angle to ratate with
         */
    ,
    rotate : function(theta) {
        // simplifying computition of 2x2 matrix
        // for more information see slides in part 1
        var c = Math.cos(theta);
        var s = Math.sin(theta);

        // iterate thru each vertex and change position
        for (var i = 0, len = this.points.length; i < len; i += 2) {
            var x = this.points[i];
            var y = this.points[i + 1];

            this.points[i] = c * x - s * y;
            this.points[i + 1] = s * x + c * y;
        }
    },

    /**
     * Scale the polygon with the scalefactor
     * 
     * @param  {number} c scalefactor
     */
    scale : function(c) {
            // ordinary vector multiplication
            for (var i = 0, len = this.points.length; i < len; i++) {
                this.points[i] *= c;
            }
        },
        /**
         * Useful point in polygon check, taken from:
         * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
         *
         * @param  {number} ox offset x coordinate
         * @param  {number} oy offset y coordinate
         * @param  {number}  x test x coordinate
         * @param  {number}  y test y coordinate
         * @return {Boolean}   result from check
         */
    hasPoint : function(ox, oy, x, y) {
        var c = false;
        var p = this.points;
        var len = p.length;

        // doing magic!
        for (var i = 0, j = len - 2; i < len; i += 2) {
            var px1 = p[i] + ox;
            var px2 = p[j] + ox;

            var py1 = p[i + 1] + oy;
            var py2 = p[j + 1] + oy;

            if ((py1 > y != py2 > y) &&
                (x < (px2 - px1) * (y - py1) / (py2 - py1) + px1)
            ) {
                c = !c;
            }
            j = i;
        }
        return c;
    },
    toString : function() {
        return this.type;
    },
        /**
     * Scale the polygon with the scalefactor
     * 
     * @param  {number} testPoint scalefactor
     */
    isContainsPoint : function(testPoint) {
        var poly = this.points;
        var inside = false,
            length = poly.length;
        for (var i = 0, j = length - 1; i < length; j = i++) {
            if (((poly[i].y > testPoint.y) != (poly[j].y > testPoint.y)) &&
                (testPoint.x < (poly[j].x - poly[i].x) * (testPoint.y - poly[i].y) /
                    (poly[j].y - poly[i].y) + poly[i].x))
                inside = !inside;
        }
        return inside;
    },
    /**
         * Draw the polygon with an augmented drawing context
         * 
         * @param  {context2d} ctx augmented drawing conext
         */

    draw : function(g) {
        g.beginPath();
        g.strokeStyle = this.color || "white";
        var p = this.points; 
        g.moveTo(p[0].x, p[0].y);
        for (var i = 1; i < p.length - 1; i++)
            g.lineTo(p[i].x, p[i].y);
        g.closePath()
        g.stroke()
}
}

var GameObj = Polygon.extends(
    function GameObj(param) {
        this.parent = param.parent;
        this.size = param.size || 10;
        this.center = {
            x: param.x + this.size,
            y: param.y + this.size
        }
        this.x = param.x;
        this.y = param.y;
        Polygon.call(this,param);
        this.type = "GameObj";
                    /**
     * Bounds for the asteroid
     */
        this.maxX = param.parent.width;
        this.maxY = param.parent.height;
    // scale the asteroid to the specified size
    this.scale(s);
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
    },{
         /**
         * Translate and rotate the asteroid
         */
        update: function() {
            log(this.type + " update ")
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
        toString: function () {
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
        hasPoint : function(x, y) {
            return this.hasPoint.call(this.x, this.y, x, y);
        },
        debug : function(g) {
            var b = this.getBox()
            b.color = "red";
            this.drawCircle(g,b)
        },
        collision : function(other) {
            return utils.colisionCircle(this.getBox(),other.getBox());
        },
        getBox : function(){
            return {center:this.center,radius:this.radius}
        },
        drawCircle:function(g,c){
            g.beginPath();
            g.strokeStyle = color || "red";
            g.arc(c.center.x, c.center.y, c.radius, 0, 2 * Math.PI, false);
            g.closePath();
            g.stroke()
        }
    }
)