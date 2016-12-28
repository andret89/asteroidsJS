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
    this.arrayPoint = points.slice(0);
    //this.points = points.slice(0);
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
        for (var i = 0, len = this.points.length; i < len; i++) {
            this.points[i].x *= c;
            this.points[i].y *= c;
        }
    },

    toString: function () {
        return this.type;
    },
    /*
    isContainsPoint: function (testPoint) {
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
    */
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
    isContainsPoint: function (testPoint,offsetPoint) {
        var inside = false,
            poly = this.points;
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            var y1 = poly[i].y + offsetPoint.x;
            var x1 = poly[i].x + offsetPoint.y;
            var y2 = poly[j].y + offsetPoint.x;
            var x2 = poly[j].x + offsetPoint.y;

            if (((y1 > testPoint.y) != (y2 > testPoint.y)) &&
                (testPoint.x < (x2 - x1) * (testPoint.y - y1) /
                (y2 - y1) + x1))
                inside = !inside;
        }
        return inside;
    }
};