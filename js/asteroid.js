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


        // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
        this.rotation = Math.radians(Math.random() * 0.02+1);
        this.angle = Math.radians(Math.random() * 360 + 1);

        var massTemp = 4;
        if(size === sizeAsteroid/2)
            massTemp = 2;
        else if(size === sizeAsteroid/4)
            massTemp = 1;

        this.mass = massTemp;


        this.speed = 120 + 2 * difficultly;
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
            g.drawAster(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                var bbox = this.getBox();
                g.drawCircleBox(bbox.x, bbox.y, bbox.radius);
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
        elasticCollisionold: function (aster) {
            if (this.hitTestCircle(aster.x, aster.y, aster.radius)) {
                var dbg = true;
                    this.elasticCollisionbak(aster);

                if(dbg)
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
            }

        },
        elasticCollision: function (ball2) {
            if (!this.hitTestCircle(ball2.x,ball2.y,ball2.radius) || this.distance(ball2) < this.radius-2)
                    return;

            var ball1 = this;

            var dx = ball1.x - ball2.x;
            var dy = ball1.y - ball2.y;
            var dvx = ball1.vx * ball1.vx + ball1.vy * ball1.vy;
            var dvy = ball2.vx * ball2.vx + ball2.vy * ball2.vy;


            //find the angle of the collision
            var collisionAngle = Math.atan2(dy, dx);

            var speed1 = Math.sqrt(dvx);
            var speed2 = Math.sqrt(dvy);

            var direction1 = Math.atan2(ball1.vy, ball1.vx);
            var direction2 = Math.atan2(ball2.vy, ball2.vx);

            var speed_1x = speed1 * Math.cos(direction1 - collisionAngle);
            var speed_1y = speed1 * Math.sin(direction1 - collisionAngle);
            var speed_2x = speed2 * Math.cos(direction2 - collisionAngle);
            var speed_2y = speed2 * Math.sin(direction2 - collisionAngle);

            // m1v1 = m2v2

            var final_velocityx_1 = ((ball1.mass - ball2.mass) * speed_1x +
                (ball2.mass + ball2.mass) * speed_2x) / (ball1.mass + ball2.mass);

            var final_velocityx_2 = ((ball1.mass + ball1.mass) * speed_1x +
                (ball2.mass - ball1.mass) * speed_2x) / (ball1.mass + ball2.mass);

            var final_velocityy_1 = speed_1y;
            var final_velocityy_2 = speed_2y;

            ball1.vx = Math.cos(collisionAngle) * final_velocityx_1 +
                Math.cos(collisionAngle + Math.PI / 2) * final_velocityy_1;

            ball1.vy = Math.sin(collisionAngle) * final_velocityx_1 +
                Math.sin(collisionAngle + Math.PI / 2) * final_velocityy_1;

            ball2.vx = Math.cos(collisionAngle) * final_velocityx_2 +
                Math.cos(collisionAngle + Math.PI / 2) * final_velocityy_2;

            ball2.vy = Math.sin(collisionAngle) * final_velocityx_2 +
                Math.sin(collisionAngle + Math.PI / 2) * final_velocityy_2;

           /* ball1.vx += 2;
            ball1.vy += 2;
            ball2.vx -= 2;
            ball2.vy -= 2;*/
        }
    }
);