/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @class Rappresenta un Asteroide
 * @extends GameObj
 */
var Asteroid = GameObj.extend(
    /**
     * @constructor
     */
    function Asteroid(x, y, size, parent) {
        GameObj.call(this, x, y, size, parent);
        this.type = "Asteroid";
        this.color = "grey";
        this.img = new Image();
        this.img.src = "img/aster.png";

        // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
        this.rotation = 0.02 * (Math.random() * 2 - 1);
        this.angle = this.rotation;


        var maxSpeed = 140;
        var minSpeed = 80;
        // calcolare la velocità
        var r = Math.PI * Math.random();
        var v = (Math.random() * maxSpeed) + minSpeed;
        var vx = v;
        var vy = v;

        if(Math.random() > 0.5)
            vx *= -1;

        if(Math.random() > 0.5)
            vy *= -1;

        this.vel = {
            x: vx * Math.cos(r),
            y: vy * Math.sin(r)
        };
    }, {
        /**
         * Aggiornamento posizione e rotazione
         * @param dt
         */
        update: function(dt) {
            // aggiornameto per il ridimenzionamento
            if (this.maxX !== this.parent.width)
                this.maxX = this.parent.width;
            if (this.maxY !== this.parent.height)
                this.maxY = this.parent.height;

            // aggioranemto posizione secondo la velocità
            this.x += this.vel.x * dt;
            this.y += this.vel.y * dt;

            // movimento player nel canvas
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
            this.angle += this.rotation;
        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function(g) {
            g.drawAster(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                g.drawCircleBox(this.x, this.y, this.radius);
            }
        },
        /**
         * Verifica se c'è collisione con un missile
         * @param {number} x - coordinate x
         * @param {number} y - coordinate y
         * @returns {Bollean} Risultato test di collisione
         */
        isCollision: function(x, y) {
            return this.collisionCircle(x, y);
        }
    }
);