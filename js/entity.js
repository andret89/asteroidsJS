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
    this.angle = 0;
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
    hitTestCircle: function(cx, cy, r) {
        var _r = r || 0; // 0 per distanza da un punto
        return this.distance({ x: cx, y: cy }) < this.radius + _r;
    },
    /**
     * Distanza con un oggetto di gioco utilizzando il teorema di Pitagora
     * @param  {Object} otherObj - oggetto
     * @return {number} Distanza
     */
    distance: function(otherObj) {
        var dx = otherObj.x - this.x;
        var dy = otherObj.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};