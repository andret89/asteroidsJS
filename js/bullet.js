/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} angle  - angolo di rotazione
 * @param  {Canvas} parent - componente per il disegno
 * @param  {Boolean} isEnemy - missile del nemico
 * @class Rappresenta un missile del Player
 */
var Bullet = function Bullet(x, y, angle, parent, isEnemy) {
    this.type = "Bullet";
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.active = true;
    this.isEnemy = isEnemy || false;
    this.color = this.isEnemy ? "red" : "yellow";
    // tempo di vita
    this.timeout = 1500;
    this.startTime = new Date().getTime();

    // calcolare la velocità secondo l'algolo di rotazione del player
    // pixel per secondo
    var v = this.isEnemy ? 250 : 400;
    this.vel = {
        x: v * Math.cos(angle),
        y: v * Math.sin(angle)
    }
};
Bullet.prototype = {
    /**
     * Aggionarna la posizione del missile
     * @param {Number} dt - delta del tempo per frame
     */
    update: function(dt) {

        if(new Date().getTime() - this.startTime > this.timeout ){
            this.active = false;
            return;
        }

        // aggiornameto per ridimenzionamento finestra
        if (this.maxX !== this.parent.width)
            this.maxX = this.parent.width;
        if (this.maxY !== this.parent.height)
            this.maxY = this.parent.height;



        /*
        // movimento missile nel canvas
        if (this.x > this.maxX)
            this.x = 0;
        else
            if (this.x < 0)
                this.x = this.maxX;

        if (this.y > this.maxY)
            this.y = 0;
        else
            if (this.y < 0)
                this.y = this.maxY;
        */
        if(this.x < 0 || this.x > this.maxX ||
            this.y < 0|| this.y > this.maxY )
            this.active = false;


        // ultima posizione per disegno
        this.oldx = this.x;
        this.oldy = this.y;

        // aggiorna posizione
        this.x += this.vel.x * dt;
        this.y += this.vel.y * dt;
    },

    /**
     * Disegna il missile
     * @param  {Canvas} g - oggetto per disegnare sul canvas
     */
    draw: function(g) {
        g.drawBullet(this.oldx, this.oldy, this.x, this.y, this.color)
    }
}