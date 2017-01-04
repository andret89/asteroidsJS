var Game = function (main) {
    this.gameOver = false;
    this.screen = main.screen;
    this.main = main;
    this.main.score = 0;

    this.lvl = 1;
    this.n_life = 4;
    this.asterSize = 10;
    this.player = new Player({
        size: 6,
        x: screen.width / 2,
        y: screen.height / 2,
        parent: screen
    })
    this.genLevel();
};
Game.prototype = {
    genLevel: function () {
        this.bullets = [];
        this.asteroids = [];
        var n_asteroids = Math.round(2 + ( this.lvl / 2));
        for (var i = 0; i < n_asteroids; i++) {
            // choose asteroid polygon randomly
            var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

            // set position close to edges of canvas
            var x = 0, y = 0;
            if (Math.random() > 0.5) {
                x = Math.random() * this.screen.width;
            } else {
                y = Math.random() * this.screen.height;
            }
            var aster = new Asteroid({
                size: this.asterSize,
                x: x,
                y: y,
                typeAster: n,
                parent: this.screen
            });
            this.asteroids.push(aster);
        }
    },
    updateScore: function (a) {
        // update score depending on asteroid size
        switch (a.size) {
            case this.asterSize:
                this.main.score += 20;
                break;
            case this.asterSize / 2:
                this.main.score += 50;
                break;
            case this.asterSize / 4:
                this.main.score += 100;
                break;
        }

        // if asteroid splitted twice, then remove
        // else split in half
        if (a.size > this.asterSize / 4) {
            for (var k = 0; k < 2; k++) {
                var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

                var astr = new Asteroid({
                    size: a.size / 2,
                    x: a.x,
                    y: a.y,
                    typeAster: n,
                    parent: this.main.screen
                });
                this.asteroids.push(astr);
            }
        }
    },
    update: function (input, dt) {
        if(this.main.menu.active || Main.paused)
            return;

        if (input.isPressed('KEY_ESC') || input.isPressed('KEY_P')) {
            log("pause");
            this.main.menu.enable();
            return;
        }
        if (!this.player.active) {
            if (input.isPressed("KEY_SPACE")) {
                // change state if main over
                if (this.mainOver) {
                    this.menu.setVisibility("resumeGame", 'none');
                    this.menu.setVisibility("startGame", 'block');
                    Main.state = States.GAMEOVER;
                    return;
                }
                this.player.active = true;
            }
            return;
        }
        this.player.shield = false;
        if (input.isDown('KEY_UP') || input.isDown('KEY_W')) {
            this.player.addSpeed()
            this.main.sm.playSound('fire')
        }
        if (input.isDown('KEY_DOWN') || input.isDown('KEY_S')) {
            if (this.player.energy >= 10)
                this.player.shield = true;
        }
        if ((input.isPressed('KEY_DOWN') || input.isPressed('KEY_S'))) {
            this.main.sm.playSound('shield')
        }
        else if (!this.player.shield)
            this.main.sm.stopSound('shield')
        if (input.isDown('KEY_RIGHT') || input.isDown('KEY_D')) {
            this.player.addDirection(Math.radians(4));
        }
        if (input.isDown('KEY_LEFT') || input.isDown('KEY_A')) {
            this.player.addDirection(Math.radians(-4));
        }
        if (input.isPressed('KEY_CTRL') || input.isPressed('KEY_SPACE')) {
            if (this.player.energy >= 10) {
                this.bullets.push(this.player.addBullet(8));
                this.main.sm.playSound('shoot');
            }
        }
        var self = this;
        this.asteroids.forEach(function (a) {
            a.update(dt);

            // check if bullets hits the current asteroid
            self.bullets.forEach(function (b) {
                if (a.isCollision(b.x, b.y)) {
                    b.active = false;
                    a.active = false;
                    self.main.sm.playSound('explosion')
                    self.updateScore(a)
                }
            });
            // if ship collids reset position and decrement n_life
            if (a.active && self.player.isCollision(a)) {
                self.main.sm.playSound('explosion')
                if (!self.player.shield) {
                    self.player.active = false;
                    self.player.x = self.screen.width / 2;
                    self.player.y = self.screen.height / 2;
                    self.player.vel = {
                        x: 0,
                        y: 0
                    };
                    self.player.hp -= 100 / self.n_life;
                }
                self.updateScore(a);
                a.active = false;
            }

            if (self.player.hp <= 0) {
                self.gameOver = true;
            }
        });

        // check if lvl completed
        if (this.asteroids.length === 0) {
            this.lvl++;
            if (this.player.hp < 100)
                this.player.hp += 100 / this.n_life;
            this.genLevel();
        }

        // update ship
        this.player.update(dt);

        this.bullets = self.bullets.filter(function (b) {
            var _active = b.active;
            if (_active)
                b.update(dt);
            return _active;
        });

        this.asteroids = self.asteroids.filter(function (a) {
            return a.active;
        });

        if (this.gameOver) {
            this.main.nextState = States.GAMEOVER;
        }
    },
    draw: function (g) {
        // barre
        this.drawProgressBar(g);
        this.asteroids.forEach(function (a) {
            a.draw(g)
        });
        this.bullets.forEach(function (b) {
            b.draw(g);
        });

        // draw ship
        this.player.draw(g);

        if (!this.player.active) {
            var ga = g.ctx;

            ga.fillStyle = "white";
            ga.font = "25px sans-serif";
            ga.fillText("Push spacebar for continue ", g.canvas.width / 2 - 150, g.canvas.height / 2);
        }

    },
    drawProgressBar: function (g) {
        var ga = g.ctx;
        var percent = this.player.hp / 100;
        var offset_hp = g.canvas.width / 2 + 280;
        var offset_top = g.canvas.offsetTop + 10;
        var barWidth = 150;
        var barHeight = 20;

        ga.fillStyle = "grey";
        ga.fillRect(offset_hp + 30, offset_top, barWidth, barHeight);

        ga.fillStyle = "red";
        ga.fillRect(offset_hp + 30, offset_top, barWidth * percent, barHeight);

        ga.fillStyle = "white";
        ga.font = "20px sans-serif";
        ga.fillText("HP ", offset_hp, offset_top + 18);

        percent = this.player.energy / 100;
        var offset_nrg = g.canvas.offsetLeft + 60;

        ga.fillStyle = "grey";
        ga.fillRect(offset_nrg + 45, offset_top, barWidth, barHeight);

        ga.fillStyle = "#1569C7";
        ga.fillRect(offset_nrg + 45, offset_top, barWidth * percent, barHeight);

        ga.fillStyle = "white";
        ga.font = "20px sans-serif";
        ga.fillText("NRG ", offset_nrg, offset_top + 18);


        ga.fillStyle = "white";
        ga.font = "25px sans-serif";
        ga.fillText("SCORE: " + this.main.score, offset_nrg + 410, offset_top + 18);

    }
}
