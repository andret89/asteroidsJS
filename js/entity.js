/**
 * Polygon
 *
 * @class Rappresenta un poligono
 * @param  {Array<number>} points - lista di punti del poligono
 * @constructor
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
     * Ruota il poligono
     *
     * @param  {number} theta - angolo di rotazione
     */
    rotate: function(theta) {
        // simplifying computition of 2x2 matrix
        var c = Math.cos(theta);
        var s = Math.sin(theta);

        for (var i = 0, len = this.points.length; i < len; i++) {
            var x = this.points[i].x;
            var y = this.points[i].y;

            this.points[i].x = c * x - s * y;
            this.points[i].y = s * x + c * y;
        }
    },

    /**
     * Scala il poligono
     *
     * @param  {number} c - fattore di scala
     */
    scale: function(c) {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x *= c;
            this.points[i].y *= c;
        }
    }
};
/**
 * GameObj class, oggetto che rappresenta un oggetto animabile
 * @class
 * @constructor
 * @param  {} param
 */
var GameObj = function(param) {
    this.parent = param.parent;
    this.size = param.size;
    this.radius = this.size * 4;
    this.x = param.x;
    this.y = param.y;
    this.active = true;

};
GameObj.prototype = {
    /**
     * @param  {} cx
     * @param  {} cy
     * @param  {} r
     */
    collisionCircle: function(cx, cy, r) {
        var _r = r || 0; // 0 per distanza da un punto
        return this.distance(this, { x: cx, y: cy }) < this.radius + _r;
    },
    /**
     * @param  {} ent1
     * @param  {} ent2
     */
    distance: function(ent1, ent2) {
        var dx = ent2.x - ent1.x;
        var dy = ent2.y - ent1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};