/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'astronave
 * @param  {Canvas} parent - componente per il disegno
 * @class Rappresenta l'astronave del Player
 * @extends GameObj
 */
var Player = GameObj.extend(
    /**
     * * @constructor
     */
    function Player(x, y, size, parent) {
        GameObj.call(this, x, y, size, parent);
        this.color = "green";
        this.img = new Image();
        this.img.src = "img/ship2.jpg";
        this.hp = 100;
        this.energy = 100;
        this.timeLastShoot = 0;
        this.startPowerLaser = 0;
        this.timeoutShoot = 500;
        this.timeoutPowerLaser = 10000;
        this.powerLaser = false;

        this.shieldActive = false;
        this.shield = {
            img: new Image(),
            offsetY: 34,
            offsetX: -2
        };
        this.shield.img.src = "img/shield.png";

        // oggetto per rappresentare il jet fire
        this.jetFireActive = false;
        this.jetFire = {
            img: new Image(),
            offsetY: 30,
            offsetX: -2
        };
        this.jetFire.img.src = "img/jetfire.png";

        this.vel = {
            x: 0,
            y: 0
        };


    }, {
        /**
         * Ritorna un missile
         * @return {Bullet} missile del player
         */
        addBullet: function (bullets) {
            var now = new Date().getTime();
            if (this.timeLastShoot !== 0 &&
                now - this.timeLastShoot < this.timeoutShoot)
                return false;
            else
                this.timeLastShoot = now;

            if (this.energy > 10)
                this.energy -= 10;

            bullets.push(new Bullet(
                this.x,
                this.y,
                this.angle,
                this.parent));

            if (this.powerLaser) {
                if (now - this.startPowerLaser < this.timeoutPowerLaser) {
                    bullets.push(new Bullet(
                        this.x,
                        this.y,
                        this.angle + Math.radians(-4),
                        this.parent));
                    bullets.push(new Bullet(
                        this.x,
                        this.y,
                        this.angle + Math.radians(4),
                        this.parent));
                }else
                    this.powerLaser = false;
            }

            return true;
        },
        fullLaser:function (bullets) {
            this.energy = 0;
            for(var i=0; i<360; i+=5)
            {
                bullets.push(new Bullet(
                    this.x,
                    this.y,
                    this.angle + Math.radians(i),
                    this.parent));
            }

        },
        /**
         * Aggiorna velocità in caso di accelerazione
         */
        addSpeed: function () {

            // 		a*a + b*b = c*c
            if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 400 * 400) {
                this.vel.x += 15 * Math.cos(this.angle);
                this.vel.y += 15 * Math.sin(this.angle);
            }
            this.jetFireActive = true;
        }
        ,
        /**
         * Ruota l'astronave nella direzione indicata dell'angolo
         *
         * @param  {Number} theta - angolo di rotazione
         */
        addDirection: function (theta) {
            this.angle += theta;
        }
        ,
        /**
         * Verifica se un asteroide ha una collisione con il player
         *
         * @param  {Asteroid} astr - asteroide da testare
         * @return {Boolean}  Risultato collisione
         */
        isCollision: function (astr) {
            if (!this.active) {
                return false;
            }
            return this.collisionCircle(astr.x, astr.y, astr.radius);
        }
        ,
        /**
         * Aggionarna la posizione del player
         * @param {Number} dt - delta del tempo per frame
         */
        update: function (dt) {
            if (!this.active)
                return;

            // aggiornameto secondo le dimesioni del componente padre
            if (this.maxX !== this.parent.width)
                this.maxX = this.parent.width;
            if (this.maxY !== this.parent.height)
                this.maxY = this.parent.height;

            // aggioranemto posizione secondo la velocità
            this.x += this.vel.x * dt;
            this.y += this.vel.y * dt;

            // frizione
            this.vel.x *= 0.96;
            this.vel.y *= 0.96;

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
            // gestione quantità di energia usata
            if (this.shieldActive) {
                if (this.energy > 0 && this.energy <= 100)
                    this.energy -= 1.5;
                if (this.energy <= 0)
                    this.shieldActive = false;
            } else {
                if (this.energy < 100) this.energy += 0.2;
                if (this.energy > 100) this.energy = 100;
            }
        }
        ,
        /**
         * Disegna il player
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function (g) {
            if (!this.active) {
                return;
            }
            g.drawPlayer(this, this.x, this.y);
            this.jetFireActive = false;
            if (Main.DEBUGBOX)
                g.drawCircleBox(this.x, this.y, this.radius);

        }
    }
    )
    ;