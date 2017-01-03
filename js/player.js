var Player = GameObj.extend(
    function Player(param) {
        param.points = Points.SHIP;
        GameObj.call(this, param);
        this.color = "green";
        this.active = true;
        this.angle = 0;
        this.jetFireActive = false;
        this.img = new Image();
        this.img.src ="img/ship2.png";
        this.radius = this.size*4;
        this.hp = 100;
        this.energy = 100;
        this.shield = false;
        // create, init and scale flame polygon
        this.jetFire = new Polygon(Points.JETFIRE);
        this.jetFire.color = "red";
        this.jetFire.scale(param.size);
        this.vel = {
            x: 0,
            y: 0
        }
    },
    {
        /**
         * Create and return bullet with arguments from current
         * direction and position
         *
         * @return {Bullet} the initated bullet
         */
        addBullet: function (size) {
            if(this.energy > 10)
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
         * Update the velocity of the bullet depending on facing
         * direction
         */
        addSpeed: function () {
            // length of veloctity vector estimated with pythagoras
            // theorem, i.e.
            // 		a*a + b*b = c*c
            if (this.vel.x + this.vel.y < 20 ) {
                this.vel.x += 0.2 * Math.cos(this.angle);
                this.vel.y += 0.2 * Math.sin(this.angle);
            }
            this.jetFireActive = true;
        },

        /**
         * Rotate the ship and flame polygon clockwise
         *
         * @param  {number} theta angle to rotate with
         *
         * @override Polygon.rotate
         */
        addDirection: function (theta) {
            this.angle += theta;
        },
        /**
         * Returns whether ship is colling with asteroid
         *
         * @param  {Asteroid} astr asteroid to test
         * @return {Boolean}       result from test
         */
        isCollision: function (astr) {
            if (!this.active) {
                return false;
            }
            return this.collisionCircle(astr.x,astr.y, astr.radius);

        },
        update: function () {
            // update position
            this.x += this.vel.x;
            this.y += this.vel.y;

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
        draw: function (g) {
            if (!this.active) {
                return;
            }
            if (this.shield)
                g.drawCircle({
                        center: {x: this.x, y: this.y},
                        radius: this.radius+4, color: "#1569C7"
                    }
                    , 0, 0);
            g.drawPlayer(this, this.x, this.y);
            if (this.jetFireActive) {
                this.jetFire.angle = this.angle;
                g.drawfillPolygon(this.jetFire, this.x, this.y);
                this.jetFireActive = false;
            }
            if(DEBUG_BOX)
                g.drawCircleBox(this.x,this.y,this.radius);

        }
    }
);