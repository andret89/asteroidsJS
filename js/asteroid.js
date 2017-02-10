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

        // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
        this.rotation = Math.radians(Math.random()*1.02);
        this.angle = Math.radians(Math.random()*360+1);
        this.mass = 0.5;


        var maxSpeed = 120 + 20 * difficultly;
        var minSpeed = 60;
        this.xunits = this.yunits = 0;
        this.speed = 120 + 2*difficultly;
        this.speedX = Math.cos(this.angle) * this.speed;
        this.speedY = Math.sin(this.angle) * this.speed;

        // calcolare la velocità
        this.updateDirection();

    }, {
        /**
         * Aggiornamento posizione e rotazione
         * @param dt
         */
        update: function(dt) {
            // aggiornameto per il ridimenzionamento
            var canvasWidth = this.parent.width;
            var canvasHeight = this.parent.height;

            // aggioranemto posizione secondo la velocità
            this.x += this.xunits * dt;
            this.y += this.yunits * dt;

            // movimento player nel canvas
            if (this.x  > canvasWidth)
                this.x = 0;
            else if (this.x < 0)
                this.x = canvasWidth;

            if (this.y > canvasHeight)
                this.y = 0;
            else if (this.y < 0)
                this.y = canvasHeight;

            this.angle += this.rotation;
        },
        updateDirection: function() {
            this.xunits = Math.cos(this.angle) * this.speed;
            this.yunits = Math.sin(this.angle) * this.speed;
        },
        /**
         * Disegna un asteroide
         *
         * @param  {Canvas} g - oggetto per disegnare sul canvas
         */
        draw: function(g) {
            g.drawAster(this, this.x, this.y);
            if (Main.DEBUGBOX) {
                var bbox = this.getBox();
                g.drawCircleBox(bbox.x, bbox.y, bbox.radius);

            }
        },
        getBox: function(){
            return {
                x:this.x,
                y:this.y,
                radius:this.radius
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
        },
        elasticCollision:function (ball2) {
            var ball1 = this;
            var dx = ball1.x - ball2.x;
            var dy = ball1.y - ball2.y;


            //find the angle of the collision
            var collisionAngle = Math.atan2(dy,dx);


            var speed1 = Math.sqrt(ball1.speedX * ball1.speedX +
                ball1.speedY *   ball1.speedY);

            var speed2 = Math.sqrt(ball2.speedX * ball2.speedX +
                ball2.speedY *   ball2.speedY);

            var direction1 = Math.atan2(ball1.speedY, ball1.speedX);
            var direction2 = Math.atan2(ball2.speedY, ball2.speedX);

            var speed_1x = speed1 * Math.cos(direction1 - collisionAngle);
            var speed_1y = speed1 * Math.sin(direction1 - collisionAngle);
            var speed_2x = speed2 * Math.cos(direction2 - collisionAngle);
            var speed_2y = speed2 * Math.sin(direction2 - collisionAngle);

            // m1v1 = m2v2

            var final_velocityx_1 = ((ball1.mass - ball2.mass) * speed_1x +
                (ball2.mass + ball2.mass) * speed_2x)/(ball1.mass + ball2.mass);

            var final_velocityx_2 = ((ball1.mass + ball1.mass) * speed_1x +
                (ball2.mass - ball1.mass) * speed_2x)/(ball1.mass + ball2.mass);

            var final_velocityy_1 = speed_1y;
            var final_velocityy_2 = speed_2y;

            ball1.speedX = Math.cos(collisionAngle) * final_velocityx_1 +
                Math.cos(collisionAngle + Math.PI/2) * final_velocityy_1;

            ball1.speedY = Math.sin(collisionAngle) * final_velocityx_1 +
                Math.sin(collisionAngle + Math.PI/2) * final_velocityy_1;

            ball2.speedX = Math.cos(collisionAngle) * final_velocityx_2 +
                Math.cos(collisionAngle + Math.PI/2) * final_velocityy_2;

            ball2.speedY = Math.sin(collisionAngle) * final_velocityx_2 +
                Math.sin(collisionAngle + Math.PI/2) * final_velocityy_2;

            ball1.xunits += ball1.speedX;
            ball1.yunits += ball1.speedY;
            ball2.xunits += ball2.speedX;
            ball2.yunits += ball2.speedY;
        }
    }
);