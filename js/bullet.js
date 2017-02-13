/**
 * @class Rappresenta un missile del Player
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} angle  - angolo di rotazione
 * @param  {Canvas} parent - componente per il disegno
 * @param  {Boolean} isEnemy - missile del nemico
 */
var Bullet = function Bullet(x, y, angle, parent, isEnemy) {
    this.type = "Bullet";
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.active = true;
    this.isEnemy = isEnemy || false;
    this.color = this.isEnemy ? "red" : "yellow";

    // calcolare la velocità secondo l'algolo di rotazione del player
    // pixel per secondo
    var v = this.isEnemy ? 250 : 400;
    this.vx = v * Math.cos(angle)
    this.vy = v * Math.sin(angle)
    
};
Bullet.prototype = {
    /**
     * Aggionarna la posizione del missile
     * @param {Number} dt - delta del tempo per frame
     */
    update: function(dt) {

        // aggiornameto per ridimenzionamento finestra
        var canvasWidth = this.parent.width
        var canvasHeight = this.parent.height

        
        // movimento missile nel canvas
        if(this.x < 0 || this.x > canvasWidth ||
            this.y < 0|| this.y > canvasHeight )
            this.active = false;


        // ultima posizione per disegno
        this.oldx = this.x;
        this.oldy = this.y;

        // aggiorna posizione
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    },

    /**
     * Disegna il missile
     * @param  {Canvas} g - oggetto per disegnare sul canvas
     */
    draw: function(g) {
        g.drawBullet(this.oldx, this.oldy, this.x, this.y, this.color)
    }
}