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
    var make = function (points) {
        var p = [],
            j = 0;
        for (var i = 0; i < points.length - 1; i += 2)
            p[j++] = (new Point(points[i], points[i + 1]));
        return p;
    };
    var l = make(points);
    this.points = l;
}
Polygon.prototype = {
    toString: function () {
        return (this.type + " : " + this.points);
    }
    /**
     * Rotate the polygon clockwise
     *
     * @param  {number} theta angle to ratate with
     */
    ,
    rotate: function (theta) {
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
    scale: function (c) {
        // ordinary vector multiplication
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x *= c;
            this.points[i].y *= c;
        }
    },

    toString: function () {
        return this.type;
    },
    /**
     * Useful point in polygon check, taken from:

     * @param  {number}  x test x coordinate
     * @param  {number}  y test y coordinate
     * @return {Boolean}   result from check
     */
    isContainsPoint: function (tx,ty) {
        var p = this.points;
        var inside = false;
        for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
            var y1 = p[i].y;
            var x1 = p[i].x;
            var y2 = p[j].y;
            var x2 = p[j].x;

            if (((y1 > ty) != (y2 > ty)) &&
                (tx < (x2 - x1) * (ty - y1) /
                (y2 - y1) + x1))
                inside = !inside;
        }
        return inside;
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
    pnPoly: function (ox,oy,tx,ty) {
        var inside = false,
            p = this.points;
        for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
            var y1 = p[i].y + ox;
            var x1 = p[i].x + oy;
            var y2 = p[j].y + ox;
            var x2 = p[j].x + oy;

            if (((y1 > ty) != (y2 > ty)) &&
                (tx < (x2 - x1) * (ty - y1) /
                (y2 - y1) + x1))
                inside = !inside;
        }
        return inside;
    }
};