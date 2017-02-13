/**
 * @class Rappresenta un Astronave nemica
 * @extends GameObj
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @param  {number} difficultly - livello di difficoltà
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

        // time random per probabilita di sparo
        this.randomShoot = 0.995;
        this.randomShootDefault = 0.995;
        this.randomShootMore = 0.97;

        // valori per direzione
        this.dx = this.dy = 1;
        this.speed = 30 * difficultly;

        this.timeOut = 10000;

    }, {
        /**
         * Ritorna un missile
         * @return {Bullet} missile del player
         */
        tryShoot: function () {
            if (Math.random() > this.randomShoot)
                return new Bullet(
                    this.x,
                    this.y,
                    this.angle + Math.radians(180),
                    this.parent,
                    true // missile nemico
                );
        },
        nearTarget: function () {
            var dist = this.distance(this.target)
            return this.target.active && dist < 300;
        },
        /**
         * Aggiornamento posizione e rotazione
         * @param dt
         */
        update: function (dt) {
            // aggiornameto per ridimenzionamento finestra
            var canvasWidth = this.parent.width
            var canvasHeight = this.parent.height


            // movimento nemico nel canvas
            if (this.x > canvasWidth) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = canvasWidth;
            }
            if (this.y > canvasHeight) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = canvasHeight;
            }



            // aggioranemto poizione secondo il target(player)
            if (this.nearTarget()) {
                var dx ,dy;
                dx = this.x - this.target.x;
                dy = this.y - this.target.y;
                this.angle = Math.atan2(dy, dx);

                dx = this.target.x - this.x;
                dy = this.target.y - this.y;
                var hyp = Math.sqrt(dx * dx + dy * dy);

                dx /= hyp;
                dy /= hyp;

                this.dx = dx;
                this.dy = dy;
            }

            if(this.distance(this.target)>100 || !this.target.active) {
                this.x += this.dx * this.speed * dt;
                this.y += this.dy * this.speed * dt;
                this.randomShoot = this.randomShootDefault;
            }
            else
                this.randomShoot = this.randomShootMore;

        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function (g) {
            g.drawEnemy(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                g.drawBbox(this.x, this.y, this.radius);
            }
        },
        /**
         * Verifica se c'è collisione con un missile
         * @param {number} x - coordinate x
         * @param {number} y - coordinate y
         * @returns {Bollean} Risultato test di collisione
         */
        isCollision: function (x, y) {
            return this.hitTestCircle(x, y);
        }
    }
);