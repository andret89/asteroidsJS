var Player = GameObj.extend(
    function Player(param) {
        param.points = Points.SHIP;
        GameObj.call(this, param);
        this.color = "green";
        this.active = true;
        this.angle = 0;
        this.jetFireActive = false;
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
                x: this.points[0].x + this.x,
                y: this.points[0].y + this.y,
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
            if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 20 * 20) {
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
            this.jetFire.rotate(theta);
            this.angle += theta;
            this.rotate(theta)
        },
        /**
         * Returns whether ship is colling with asteroid
         *
         * @param  {Asteroid} astr asteroid to test
         * @return {Boolean}       result from test
         */
        collide: function (astr) {
            // don't test if not visible
            if (!this.active) {
                return false;
            }
            for (var i = 0; i < this.points.length; i++) {
                var x = this.points[i].x + this.x;
                var y = this.points[i].y + this.y;

                if (astr.isContains(x, y)) {
                    return true;
                }
            }
            return false;
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
            g.drawPlayer(this, this.x, this.y);
            if (this.jetFireActive) {
                g.drawPlayer(this.jetFire, this.x, this.y);
                this.jetFireActive = false;
            }
            if (this.shield)
                g.drawCircle({
                        center: {x: this.x, y: this.y},
                        radius: this.size * 6, color: "#1569C7"
                    }
                    , 0, 0)

        }
    }
);