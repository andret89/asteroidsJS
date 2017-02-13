/**
 * @class Rappresenta un Asteroide
 * @extends GameObj
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @param  {number} difficultly - livello di difficoltà
 */
var Asteroid = GameObj.extend(
    /**
     * @constructor
     */
    function Asteroid(x, y, size, parent, difficulty) {
        GameObj.call(this, x, y, size, parent)
        this.type = 'Asteroid'
        this.color = 'grey'
        this.img = new Image()
        this.img.src = 'img/asteroid.png'
        var sizeAsteroid = 10


        // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
        this.rotation = 0.02 * (Math.random() * 2 - 1)
        this.angle = Math.PI * Math.random();

        var massTemp = 4
        if (size === sizeAsteroid / 2)
            massTemp = 2
        else if (size === sizeAsteroid / 4)
            massTemp = 1

        this.mass = massTemp

        var maxSpeed = 120 + 20 * difficulty
        var minSpeed = 60
        this.checkMaxSpeed = false;

        // calcolare la velocità
        var v = Math.randInt(maxSpeed, minSpeed)
        var vx = v
        var vy = v

        if (Math.random() > 0.5)
            vx *= -1

        if (Math.random() > 0.5)
            vy *= -1

        this.vx = vx * Math.cos(this.angle)
        this.vy = vy * Math.sin(this.angle)
    }, {
        /**
         * Aggiornamento posizione e rotazione
         * @param dt
         */
        update: function (dt) {
            // aggiornameto per il ridimenzionamento
            var canvasWidth = this.parent.width
            var canvasHeight = this.parent.height

            if (this.checkMaxSpeed) {
                if (this.vx > this.maxSpeed) {
                    this.vx = this.maxSpeed
                }
                if (this.vx < -this.maxSpeed) {
                    this.vx = -this.maxSpeed
                }
                if (this.vy > this.maxSpeed) {
                    this.vy = this.maxSpeed
                }
                if (this.vy < -this.maxSpeed) {
                    this.vy = -this.maxSpeed
                }
            }

            // aggioranemto posizione secondo la velocità
            this.x += this.vx * dt
            this.y += this.vy * dt

            // movimento player nel canvas
            if (this.x > canvasWidth)
                this.x = 0
            else if (this.x < 0)
                this.x = canvasWidth

            if (this.y > canvasHeight)
                this.y = 0
            else if (this.y < 0)
                this.y = canvasHeight

            this.angle += this.rotation
        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function (g) {
            g.drawImageCircle(this, this.x, this.y)
            if (Main.DEBUGBOX) {
                var bbox = this.getBox()
                g.drawBbox(bbox.x, bbox.y, bbox.radius)
                g.drawVelocity(this)
            }
        },
        getBox: function () {
            return {
                x: this.x,
                y: this.y,
                radius: this.radius
            }
        },
        /**
         * Verifica se c'è collisione con un missile
         * @param {number} x - coordinate x
         * @param {number} y - coordinate y
         * @returns {Bollean} Risultato test di collisione
         */
        isCollision: function (x, y) {
            return this.hitTestCircle(x, y)
        },
        /**
         * Risolve le collisioni tra asteroidi
         */
        elasticCollision: function (aster) {

            if (!this.hitTestCircle(aster.x, aster.y, aster.radius))
                return;

            this.shiftPos(aster);

            var aster1 = this;
            var aster2 = aster
            var dx = aster1.x - aster2.x;
            var dy = aster1.y - aster2.y;
            var dvx = aster1.vx * aster1.vx + aster1.vy * aster1.vy;
            var dvy = aster2.vx * aster2.vx + aster2.vy * aster2.vy;


            //find the angle of the collision 
            var collisionision_angle = Math.atan2(dy, dx);

            // module velocity 
            var speed1 = Math.sqrt(dvx);
            var speed2 = Math.sqrt(dvy);

            var direction_1 = Math.atan2(aster1.vy, aster1.vx);
            var direction_2 = Math.atan2(aster2.vy, aster2.vx);

            var
                new_xspeed_1 = speed1 * Math.cos(direction_1 - collisionision_angle),
                new_yspeed_1 = speed1 * Math.sin(direction_1 - collisionision_angle),

                new_xspeed_2 = speed2 * Math.cos(direction_2 - collisionision_angle),
                new_yspeed_2 = speed2 * Math.sin(direction_2 - collisionision_angle),

                /*
                 v1fx = ((m1-m2)* v1x + (2*m2*v2x)) /(m1+m2)
                 v2fx = ((2* m1* v1x) + (m2-m1)*v2x)/(m1+m2)
                 */
                final_xspeed_1 = ((aster1.mass - aster2.mass) * new_xspeed_1 +
                    (2 * aster2.mass * new_xspeed_2)) / (aster1.mass + aster2.mass),

                final_xspeed_2 = ((2 * aster1.mass * new_xspeed_1 ) +
                    (aster2.mass - aster1.mass) * new_xspeed_2) / (aster1.mass + aster2.mass),

                final_yspeed_1 = new_yspeed_1,
                final_yspeed_2 = new_yspeed_2,

                cosAngle = Math.cos(collisionision_angle),
                cosAngle2 = Math.cos(collisionision_angle + Math.PI / 2),
                sinAngle = Math.sin(collisionision_angle),
                sinAngle2 = Math.sin(collisionision_angle + Math.PI / 2);

            aster1.vx = cosAngle * final_xspeed_1 + cosAngle2 * final_yspeed_1;
            aster1.vy = sinAngle * final_xspeed_1 + sinAngle2 * final_yspeed_1;
            aster2.vx = cosAngle * final_xspeed_2 + sinAngle2 * final_yspeed_2;
            aster2.vy = sinAngle * final_xspeed_2 + cosAngle2 * final_yspeed_2;

        },
        /**
         * Spostamento asteroidi per fix posizione dopo l'urto
         * @param aster
         */
        shiftPos: function (aster) {
            if (this.x < aster.x) {
                this.x -= 2;
                aster.x += 2;
            }
            else {
                this.x += 2;
                aster.x -= 2;
            }

            if (this.y < aster.y) {
                this.y -= 2;
                aster.y += 2;
            }
            else {
                this.y += 2;
                aster.y -= 2;
            }
        }
    }
);
