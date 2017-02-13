/**
 * @class Rappresenta un astronave nemica
 * @extends GameObj
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @param  {number} difficulty - livello di difficoltà
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
        this.img.src = "img/enemy.png";
        this.score = 200;

        // time random per probabilita di sparo
        this.randomShoot = 0.995;
        this.randomShootDefault = 0.995;
        this.randomShootMore = 0.97;

        // valori per direzione
        this.directionX = this.directionY = 1;
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


            // aggioranemto posizione secondo il target(player)
            if (this.nearTarget()) {
                var dx, dy;
                dx = this.x - this.target.x;
                dy = this.y - this.target.y;

                // angolo direzione per raggiungere il target
                this.angle = Math.atan2(dy, dx);

                dx *= -1;
                dy *= -1;

                var module_spostamento = Math.sqrt(dx * dx + dy * dy);

                if (module_spostamento !== 0) {
                    dx /= module_spostamento;
                    dy /= module_spostamento;
                }

                this.directionX = dx;
                this.directionY = dy;
            }

            if (this.distance(this.target) > 100 || !this.target.active) {
                this.x += this.directionX * this.speed * dt;
                this.y += this.directionY * this.speed * dt;
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