/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @param  {number} difficultly - livello di difficoltà
 * @class Rappresenta un Asteroide
 * @extends GameObj
 */
var Asteroid = GameObj.extend(
    /**
     * @constructor
     */
    function Asteroid(x, y, size, parent, difficultly) {
        GameObj.call(this, x, y, size, parent);
        this.type = "Asteroid";
        this.color = "grey";
        this.img = new Image();
        this.img.src = "img/aster.png";
        var sizeAsteroid = 10;
        this.justCollison = false;


        // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
        this.rotation = Math.radians(Math.random() * 0.02 + 1);
        this.angle = Math.radians(Math.random() * 360 + 1);

        var massTemp = 4;
        if (size === sizeAsteroid / 2)
            massTemp = 2;
        else if (size === sizeAsteroid / 4)
            massTemp = 1;

        this.mass = massTemp;

        this.speed = 120 + 10 * difficultly;

        this.maxSpeed = 180;
        // calcolare la velocità
        this.updateDirection();

    }, {
        /**
         * Aggiornamento posizione e rotazione
         * @param dt
         */
        update: function (dt) {
            // aggiornameto per il ridimenzionamento
            var canvasWidth = this.parent.width;
            var canvasHeight = this.parent.height;

            if (this.vx > this.maxSpeed) {
                this.vx = this.maxSpeed;
            }
            if (this.vx < this.maxSpeed * -1) {
                this.vx = this.maxSpeed * -1;
            }
            if (this.vy > this.maxSpeed) {
                this.vy = this.maxSpeed;
            }
            if (this.vy < this.maxSpeed * -1) {
                this.vy = this.maxSpeed * -1;
            }

            // aggioranemto posizione secondo la velocità
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            // movimento player nel canvas
            if (this.x > canvasWidth)
                this.x = 0;
            else if (this.x < 0)
                this.x = canvasWidth;

            if (this.y > canvasHeight)
                this.y = 0;
            else if (this.y < 0)
                this.y = canvasHeight;

            this.angle += this.rotation;
        },


        updateDirection: function () {
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function (g) {
            g.drawAsteroid(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                var bbox = this.getBox();
                g.drawBbox(bbox.x, bbox.y, bbox.radius);
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
            return this.hitTestCircle(x, y);
        },
        /**
         * https://blogs.msdn.microsoft.com/faber/2013/01/09/elastic-collisions-of-balls/
         * V1f = ((m1-m2)/(m1+m2))V1i+((2*m2)/(m1+m2))V2i
         * V2f = ((m1-m2)/(m1+m2))V2i+((2*m2)/(m1+m2))V1i
         * @param aster
         */
        elasticCollision: function (aster) {
            if (this.hitTestCircle(aster.x, aster.y, aster.radius)) {
                var dx = aster.x - this.x;
                var dy = aster.y - this.y;
                var dist = dx * dx + dy * dy;

                var dvx = aster.vx - this.vx;
                var dvy = aster.vy - this.vy;
                var scalare = dx * dvx + dy * dvy;

                if (scalare < 0) {
                    var k = (2 * scalare * (this.mass + aster.mass)) / dist;
                    var k1 = k * aster.mass;
                    this.vx += k1 * dx;
                    this.vy += k1 * dy;
                    var k2 = -k * this.mass;
                    aster.vx += k2 * dx;
                    aster.vy += k2 * dy;
                }


                this.elasticCollisionBest(aster);

                return

                var dx = aster.x - this.x;
                var dy = aster.y - this.y;

                // module velocity
                /*
                 var m1 = this.mass;
                 var m2 = aster.mass;
                 var v1x = this.vx;
                 var v1y = this.vx;
                 var v2x = aster.vx;
                 var v2y = aster.vy;
                 var d1v = Math.sqrt(v1x * v1x + v1y * v1y);
                 var d2v = Math.sqrt(v2x * v2x + v2y * v2y);


                 var phi = Math.atan2(dy, dx);
                 var theta1 = Math.atan2(this.vy, this.vx);
                 var theta2 = Math.atan2(aster.vy, aster.vx);

                 var
                 vf1x = d1v * cos(theta1 - phi),
                 vf1y = d1v * sin(theta1 - phi),
                 vf2x = d2v * cos(theta2 - phi),
                 vf2y = d2v * sin(theta2 - phi),

                 u1x = ((m1 - m2) * vf1x + (m2 + m2) * vf2x) / (m1 + m2),
                 u2x = ((m1 + m1) * vf1x + (m2 - m1) * vf2x) / (m1 + m2),
                 u1y = vf1y,
                 u2y = vf2y,

                 uf1x = u1x * cos(phi) - u1y * sin(phi),
                 uf1y = u1x * sin(phi) + u1y * cos(phi),
                 uf2x = u2x * cos(phi) - u2y * sin(phi),
                 uf2y = u2x * sin(phi) + u2y * cos(phi);

                 this.vx = uf1x;
                 this.vy = uf1y;
                 aster.vx = uf2x;
                 aster.vy = uf2y;*/

                var distance = this.distance(aster);
                var collisionPoint = (this.radius + aster.radius) - distance;

                var v1fx = (dx / distance * collisionPoint) / this.mass;
                var v1fy = (dy / distance * collisionPoint) / this.mass;

                var v2fx = (dx / distance * collisionPoint) / aster.mass;
                var v2fy = (dy / distance * collisionPoint) / aster.mass;

                this.vx += v1fx;
                this.vy += v1fy;

                aster.vx -= v2fx;
                aster.vy -= v2fy;

            }

        },
        elasticCollisionBest: function (aster) {
            if (!this.hitTestCircle(aster.x, aster.y, aster.radius) ||
                this.distance(aster) < this.radius - 4)
                return;

            var pt1 = this;
            var pt2 = aster;
            var dx = pt2.x - pt1.x;
            var dy = pt2.y - pt1.y;
            var dist = dx * dx + dy * dy;

            var dvx = pt2.vx - pt1.vx;
            var dvy = pt2.vy - pt1.vy;
            var scalar = dx * dvx + dy * dvy;

            if (scalar < 0) {
                var k = 2 * scalar / dist / (pt1.mass + pt2.mass);
                var k1 = k * pt2.mass;
                pt1.vx += k1 * dx;
                pt1.vy += k1 * dy;
                var k2 = -k * pt1.mass;
                pt2.vx += k2 * dx;
                pt2.vy += k2 * dy;
            }
        },
        microsoftCollison: function (ball2) {
            var ball1 = this;
            var dx = ball1.x - ball2.x;
            var dy = ball1.y - ball2.y;
            var dvx = ball1.vx * ball1.vx + ball1.vy * ball1.vy;
            var dvy = ball2.vx * ball2.vx + ball2.vy * ball2.vy;


            //find the angle of the collision
            var collisionision_angle = Math.atan2(dy, dx);

            var speed1 = Math.sqrt(dvx);
            var speed2 = Math.sqrt(dvy);

            var direction_1 = Math.atan2(ball1.vy, ball1.vx);
            var direction_2 = Math.atan2(ball2.vy, ball2.vx);

            var

                new_xspeed_1 = speed1 * Math.cos(direction_1 - collisionision_angle),
                new_yspeed_1 = speed1 * Math.sin(direction_1 - collisionision_angle),
                new_xspeed_2 = speed2 * Math.cos(direction_2 - collisionision_angle),
                new_yspeed_2 = speed2 * Math.sin(direction_2 - collisionision_angle),

                final_xspeed_1 = ((ball1.mass - ball2.mass) * new_xspeed_1 +
                    (ball2.mass + ball2.mass) * new_xspeed_2) / (ball1.mass + ball2.mass),
                final_xspeed_2 = ((ball1.mass + ball1.mass) * new_xspeed_1 +
                    (ball2.mass - ball1.mass) * new_xspeed_2) / (ball1.mass + ball2.mass),
                final_yspeed_1 = new_yspeed_1,
                final_yspeed_2 = new_yspeed_2,

                cosAngle = Math.cos(collisionision_angle),
                sinAngle = Math.sin(collisionision_angle);

            ball1.vx = cosAngle * final_xspeed_1 - sinAngle * final_yspeed_1;
            ball1.vy = sinAngle * final_xspeed_1 + cosAngle * final_yspeed_1;
            ball2.vx = cosAngle * final_xspeed_2 - sinAngle * final_yspeed_2;
            ball2.vy = sinAngle * final_xspeed_2 + cosAngle * final_yspeed_2;
        }
    }
);