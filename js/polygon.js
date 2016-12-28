function Point(param) {
    this.x = param.x;
    this.y = param.y;
}
/**
 * Polygon
 * Polygon class, simple polygon class with method as rotation and
 * scaling
 * 
 * @param  {Array<number>} points list of verticies
 * @param  {number} size of polygon
 */
function Polygon(points) {
    this.type = "Polygon";
    this.color = "white";
    //this.points = points.slice(0);
    var make = function(points, size) {
        var p = [],
            j = 0;
        for (var i = 0; i < points.length - 1; i += 2)
            p[j++] = (new Point({
                x: points[i],
                y: points[i + 1]
            }));
        return p;
    }
    var l = make(points)
    this.points = l;
}
Polygon.prototype = {
    toString: function() {
            return (this.type + " : " + this.points);
        }
        /**
         * Rotate the polygon clockwise
         * 
         * @param  {number} theta angle to ratate with
         */
        ,
    rotate: function(theta) {
        // simplifying computition of 2x2 matrix
        // for more information see slides in part 1
        var c = Math.cos(theta);
        var s = Math.sin(theta);

        // iterate thru each vertex and change position
        for (var i = 0, len = this.points.length; i < len; i++) {
            var x = this.points[i].x;
            var y = this.points[i].y;

            this.points[i].x = c * x - s * y;
            this.points[i].y = s * x + c * y;
        }
    },

    /**
     * Scale the polygon with the scalefactor
     * 
     * @param  {number} c scalefactor
     */
    scale: function(c) {
        // ordinary vector multiplication
        for (var i = 0, len = this.points.length; i < len; i++) {
            this.points[i].x *= c;
            this.points[i].y *= c;
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
    hasPoint: function(ox, oy, x, y) {
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
    toString: function() {
        return this.type;
    },
    /**
     * Scale the polygon with the scalefactor
     * 
     * @param  {number} testPoint scalefactor
     */
    isContainsPoint: function(testPoint) {
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

    drawl: function(g) {
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