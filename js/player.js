/**
 * Player
 *
 * @param  {number} size   - dimensione del player
 * @param  {number} x      - x coordinate
 * @param  {number} y      - y coordinate
 * @param  {Canvas} parent - componente canvas
 * @class Rappresenta un Player
 * @extends GameObj
 */
var Player = GameObj.extend(
    /**
     *
     * @param param
     * @constructor
     */
    function Player(param) {
        GameObj.call(this, param);
        this.color = "green";
        this.angle = 0;
        this.img = new Image();
        this.img.src = "img/ship2.jpg";
        this.hp = 100;
        this.energy = 100;
        this.shield = false;
        this.jetFireActive = false;
        this.jetFire = {
            img: new Image(),
            offsetY:30,
            offsetX: -2
        };
        this.jetFire.img.src = "img/jetfire.png";
//new Polygon([-2, 0, -3, -1, -5, 0, -3, 1, -2, 0]);


        var self = this;
        this.vel = {
            x: 0,
            y: 0
        };
        document.addEventListener("mousemove", function(event) {
            var mousePos = {
                x : event.clientX,
                y : event.clientY
            };
            if (Main.MOUSE_GAME && !Main.paused){
                var dx = (mousePos.x - self.x);
                var dy = (mousePos.y - self.y);
                self.angle = Math.atan2(dy, dx);
            }
        });
    }, {
        /**
         * Ritorna un missile
         * @param {Number} size - dimensione del missile
         * @returns {Bullet} missile del player
         */
        addBullet: function(size) {
            if (this.energy > 10)
                this.energy -= 10;
            var b = new Bullet({
                x: this.x,
                y: this.y,
                angle: this.angle,
                size: size,
                parent: this.parent
            });
            return b;
        },
        /**
         * Aggiorna velocità in caso di accelerazione
         */
        addSpeed: function() {

            // 		a*a + b*b = c*c
            if (this.vel.x*this.vel.x + this.vel.y*this.vel.y < 30*30) {
                this.vel.x += 1.6 * Math.cos(this.angle);
                this.vel.y += 1.6 * Math.sin(this.angle);
            }
            this.jetFireActive = true;
        },
        /**
         * Ruota l'astronave nella direzione indicata dell'angolo
         *
         * @param  {Number} theta - angolo di rotazione
         */
        addDirection: function(theta) {
            this.angle += theta;
        },
        /**
         * Verifica se un asteroide ha una collisione con il player
         *
         * @param  {Asteroid} astr - asteroide da testare
         * @return {Boolean}   risultato
         */
        isCollision: function(astr) {
            if (!this.active) {
                return false;
            }
            return this.collisionCircle(astr.x, astr.y, astr.radius);

        },
        /**
         * Aggionarna la posizione del player
         * @param {Number} dt - delta del tempo per frame
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

            // friction
            this.vel.x *= 0.98;
            this.vel.y *= 0.98;

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
            if (this.shield) {
                if (this.energy > 0 && this.energy <= 100)
                    this.energy -= 1.5;
                if (this.energy <= 0)
                    this.shield = false;
            } else {
                if (this.energy < 100) this.energy += 0.25;
                if (this.energy > 100) this.energy = 100;
            }
        },
        /**
         * Disegna il player
         * @param  {Canvas} g
         */
        draw: function(g) {
            if (!this.active) {
                return;
            }
            if (this.shield)
                g.drawCircle({
                    center: { x: this.x, y: this.y },
                    radius: this.radius + 4,
                    color: "#1569C7"
                }, 0, 0);
            g.drawPlayer(this, this.x, this.y);
            this.jetFireActive = false;
            if (Main.DEBUGBOX)
                g.drawCircleBox(this.x, this.y, this.radius);

        }
    }
);