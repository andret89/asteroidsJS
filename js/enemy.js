/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @param  {number} difficultly - livello di difficoltà
 * @class Rappresenta un Asteroide
 * @extends GameObj
 */
var Enemy = GameObj.extend(
    /**
     * @constructor
     */
    function Enemy(x, y, size, parent, difficultly, target) {
        GameObj.call(this, x, y, size, parent);
        this.type = "Enemy";
        this.color = "grey";
        this.target = target;
        this.img = new Image();
        this.hp = 100;
        this.img.src = "img/aliensh.png";
        this.score = 200;

        // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
        this.rotation = 0;

        this.speed = 10* difficultly;

        this.lastUpdate = new Date().getTime();
        this.timeOut = 10000;

        // calcolare la velocità
        var r = Math.PI * Math.random();
        var v = this.speed;

        this.vel = {
            x: v * Math.cos(r),
            y: v * Math.sin(r)
        };
    }, {
        /**
         * Ritorna un missile
         * @return {Bullet} missile del player
         */
        tryShoot: function () {
            if(Math.random()>0.995)
                return new Bullet(
                    this.x,
                    this.y,
                    this.angle + Math.radians(180),
                    this.parent,
                    true // missile nemico
            );
        },
        nearTarget:function () {
            return this.target.active && this.distance(this.target) < 300;
        },
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


            // timeoutUpdatePosition
            if(this.nearTarget) {
                var dx = this.x - this.target.x,
                    dy = this.y - this.target.y;
                this.angle = Math.atan2(dy, dx);
            }

            this.vel.x = this.speed * Math.cos(this.angle);
            this.vel.x = this.speed * Math.cos(this.angle);

            if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 80 * 80) {
                this.vel.x += this.speed;
                this.vel.x += this.speed;
            }

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
        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function(g) {
            g.drawEnemy(this, this.x, this.y);
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