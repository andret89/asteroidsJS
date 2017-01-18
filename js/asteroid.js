/**
 * Asteroid
 *
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {number} x      - x coordinate
 * @param  {number} y      - y coordinate
 * @param  {Canvas} parent - componente canvas
 * @class Rappresenta un Asteroide
 * @extends GameObj
 */
var Asteroid = GameObj.extend(
    /**
     *
     * @param param
     * @constructor
     */
    function Asteroid(param) {
        GameObj.call(this, param); // Superclass()
        this.type = "Asteroid";
        this.color = "grey";
        this.img = new Image();
        this.img.src = "img/aster.png";
        // Set rotation angle used in each update
        this.rotation = 0.02 * (Math.random() * 2 - 1);
        this.angle = this.rotation;

        // Generate and calculate velocity
        var r = Math.PI * Math.random();
        var v = (Math.random() * 14 )+6;
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
         * update position with translate and rotate
         * @param dt
         */
        update: function(dt) {
            //update for resize
            if (this.maxX !== this.parent.width)
                this.maxX = this.parent.width;
            if (this.maxY !== this.parent.height)
                this.maxY = this.parent.height;

            // update position
            this.x += this.vel.x * dt;
            this.y += this.vel.y * dt;

            // keep within bounds
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