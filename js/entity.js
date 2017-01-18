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
 * @class Rappresenta un entità animabile
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione
 * @param  {Canvas} parent - componente padre
 * @constructor
 *
 */
var GameObj = function(x,y,size,parent) {
    this.size = size;
    this.radius = size * 4;
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.active = true;

};
GameObj.prototype = {
    /**
     * Verifica intersezione con un oggetto di gioco
     * @param  {number} cx - centro in coordinate x
     * @param  {number} cy - centro in coordinate y
     * @param  {number} r - raggio
     * @return {Boolean} Risultato intersezione
     */
    collisionCircle: function(cx, cy, r) {
        var _r = r || 0; // 0 per distanza da un punto
        return this.distance({ x: cx, y: cy }) < this.radius + _r;
    },
    /**
     * Distanza con un oggetto di gioco utilizzando il teorema di Pitagora
     * @param  {GameObj} otherObj - oggetto
     * @return {number} Distanza
     */
    distance: function(otherObj) {
        var dx = otherObj.x - this.x;
        var dy = otherObj.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};