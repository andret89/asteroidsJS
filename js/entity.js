/**
 * Polygon
 * Polygon class, simple polygon class with method as rotation and
 * scaling
 *
 * @param  {Array<number>} points list of verticies
 * @param  {number} size of polygon
 */
function Polygon(points) {
    this.color = "white";
    var makePoints = function(points) {
        var p = [],
            j = 0;
        for (var i = 0; i < points.length - 1; i += 2)
            p[j++] = ({ x: points[i], y: points[i + 1] });
        return p;
    };
    var l = makePoints(points);
    this.points = l;
}
Polygon.prototype = {
    /**
     * Rotate the polygon clockwise
     *
     * @param  {number} theta angle to ratate with
     */
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
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x *= c;
            this.points[i].y *= c;
        }
    }
};

var GameObj = function(param) {
    this.parent = param.parent;
    this.size = param.size || 10;
    this.radius = this.size * 4;
    this.x = param.x;
    this.y = param.y;
    this.active = true;
    /**
     * Bounds for the asteroid
     */
    this.maxX = param.parent.width;
    this.maxY = param.parent.height;

};
GameObj.prototype = {
    collisionCircle: function(cx, cy, r) {
        var _r = r || 0; // 0 per distanza da un punto
        return this.distance(this, { x: cx, y: cy }) < this.radius + _r;
    },
    distance: function(ent1, ent2) {
        var dx = ent2.x - ent1.x;
        var dy = ent2.y - ent1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};