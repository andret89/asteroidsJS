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
        //this.speed = 1 * difficultly;
        this.speed = .004;

        this.lastUpdate = new Date().getTime();
        this.timeOut = 10000;

        this.path = {
            radius: 0,
            cx: target.x,
            cy: target.y,
            angle: 0
        };

        this.path.draw = function (g) {
            g.beginPath();
            g.strokeStyle = "white";
            g.lineWidth = 1;
            g.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2, true)
            g.closePath();
            g.stroke()
        };
        this.updatePathRadius()

    }, {
        updatePathRadius: function () {
            var distToTarget = this.distance(this.target);
            this.path.radius = Math.min(distToTarget,
                this.parent.width, this.parent.height);


        },
        /**
         * Ritorna un missile
         * @return {Bullet} missile del player
         */
        tryShoot: function () {
            if (Math.random() > 0.995)
                return new Bullet(
                    this.x,
                    this.y,
                    this.angle + Math.radians(180),
                    this.parent,
                    true // missile nemico
                );
        },
        nearTarget: function () {
            return this.target.active && this.distance(this.target) < 250;
        },
        /**
         * Aggiornamento posizione e rotazione
         * @param dt
         */
        update: function (dt) {
            // aggiornameto per il ridimenzionamento
            if (this.maxX !== this.parent.width)
                this.maxX = this.parent.width;
            if (this.maxY !== this.parent.height)
                this.maxY = this.parent.height;


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

            var path = this.path;

            // timeoutUpdatePosition
            if (this.nearTarget) {
                var dx = this.x - this.target.x,
                    dy = this.y - this.target.y;
                this.angle = Math.atan2(dy, dx);
                this.updatePathRadius();
                path.cx = this.target.x;
                path.cy = this.target.y;

                path.angle += this.speed;

                this.x = path.cx + Math.cos(path.angle) * path.radius;
                this.y = path.cy + Math.sin(path.angle) * path.radius;
            }




            /*
             if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 80 * 80) {
             this.vel.x += this.speed;
             this.vel.y += this.speed;
             }
             */

            /*
             // update circulare moviment
             this.x = this.path.cx + Math.cos(this.path.angle) * this.path.radius;
             this.y = this.path.cy + Math.sin(this.path.angle) * this.path.radius;
             */

            // aggioranemto posizione secondo la velocità


             this.x += this.speed * dt;
             this.y += this.speed * dt;


        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function (g) {
            g.drawEnemy(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                g.drawCircleBox(this.x, this.y, this.radius);
                this.path.draw(g.ctx);
            }
        },
        /**
         * Verifica se c'è collisione con un missile
         * @param {number} x - coordinate x
         * @param {number} y - coordinate y
         * @returns {Bollean} Risultato test di collisione
         */
        isCollision: function (x, y) {
            return this.collisionCircle(x, y);
        }
    }
);