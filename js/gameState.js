var GameState = State.extend(
    function GameState(game) {
        State.call(this, game); // Superclass()
        this.game.isStart = true;
        this.gameOver = false;
        this.lvl = 1;
        this.score = 0;
        this.lives = 3;
        this.hp = 100;
        this.asterSize = 8;
        this.player = new Player({
            size: 3,
            x: game.screen.width / 2,
            y: game.screen.height / 2,
            parent: game.screen
        })
        this.genLevel();
    }, {
        genLevel: function () {
            this.bullets = [];
            this.asteroids = [];
            var n_asteroids = Math.round(4 +( this.lvl/2));
            for (var i = 0; i < n_asteroids; i++) {
                // choose asteroid polygon randomly
                var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

                // set position close to edges of canvas
                var x = 0, y = 0;
                if (Math.random() > 0.5) {
                    x = Math.random() * this.game.screen.width;
                } else {
                    y = Math.random() * this.game.screen.height;
                }
                var aster = new Asteroid({
                    size: this.asterSize,
                    x: x,
                    y: y,
                    typeAster: n,
                    parent: this.game.screen
                });
                this.asteroids.push(aster);
            }
        },
        inputManager: function (input) {
            if (input.isPressed('KEY_ESC') || input.isPressed('KEY_P')) {
                log("pause");
                this.game.isPaused = true;
                this.game.menuManager.menu.enable();
            }
            if (!this.player.active) {
                if (input.isPressed("KEY_SPACE")) {
                    // change state if game over
                    if (this.gameOver) {
                        this.game.isPaused = true;
                        utils.setVisibility("resumeGame", 'none');
                        utils.setVisibility("startGame", 'block');
                        this.game.menuManager.menu.enable();
                        this.game.stateVars.score = this.score;
                        return;
                    }
                    this.player.active = true;
                }
                return;
            }
            this.player.shield = false;
            if (input.isDown('KEY_UP') || input.isDown('KEY_W')) {
                log("go");
                this.player.addSpeed()
                this.game.sm.playSound('fire')
            }
            if (input.isDown('KEY_DOWN') || input.isDown('KEY_S')) {
                log("shield");
                this.player.shield = true;
            }
            if((input.isPressed('KEY_DOWN') || input.isPressed('KEY_S'))){
                this.game.sm.playSound('shield')
            }
            else
                if(this.player.energy <= 0)
                    this.game.sm.stopSound('shield')
            if (input.isDown('KEY_RIGHT') || input.isDown('KEY_D')) {
                this.player.addDirection(Math.radians(4));
                log("RIGHT")
            }
            if (input.isDown('KEY_LEFT') || input.isDown('KEY_A')) {
                this.player.addDirection(Math.radians(-4));
                log("LEFT")
            }
            if (input.isPressed('KEY_CTRL') || input.isPressed('KEY_SPACE')) {
                if (this.player.energy > 10) {

                this.bullets.push(this.player.addBullet(8));
                log("SHOOT")
                this.game.sm.playSound('shoot');
            }
            }
        },
        update: function () {
            for (var i = 0; i < this.asteroids.length; i++) {
                var a = this.asteroids[i];
                a.update();

                // if ship collids reset position and decrement lives
                if (this.player.collide(a)) {
                    this.game.sm.playSound('explosion')
                    if(!this.player.shield) {
                        this.player.active = false;
                        this.player.x = this.game.screen.width / 2;
                        this.player.y = this.game.screen.height / 2;
                        this.player.vel = {
                            x: 0,
                            y: 0
                        };
                        this.lives--;
                        this.hp -= 100/3;
                    }
                    else
                        this.score += 50;

                    if (this.lives <= 0) {
                        this.gameOver = true;
                    }
                    this.asteroids.splice(i, 1);
                }

                // check if bullets hits the current asteroid
                for (var j = 0; j < this.bullets.length; j++) {
                    var b = this.bullets[j];

                    if (a.isContains(b.x, b.y)) {
                        this.bullets.splice(j, 1);
                        this.asteroids.splice(i, 1);
                        this.game.sm.playSound('explosion')
                        // update score depending on asteroid size
                        switch (a.size) {
                            case this.asterSize:
                                this.score += 20;
                                break;
                            case this.asterSize/2:
                                this.score += 50;
                                break;
                            case this.asterSize/4:
                                this.score += 100;
                                break;
                        }

                        // if asteroid splitted twice, then remove
                        // else split in half
                        if (a.size > this.asterSize/4) {
                            for (var k = 0; k < 2; k++) {
                                var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

                                var astr = new Asteroid({
                                    size: a.size/2,
                                    x: a.x,
                                    y: a.y,
                                    typeAster: n,
                                    parent: this.game.screen
                                });
                                this.asteroids.push(astr);
                            }
                        }

                    }
                }
            }
            // check if lvl completed
            if (this.asteroids.length === 0) {
                this.lvl++;
                this.genLevel();
            }

            // update ship
            this.player.update();
            for (var j = 0; j < this.bullets.length; j++)
                this.bullets[j].update()
        },
        render: function (g) {
            g.clearAll();
            //draw score and extra lives
            // barre
            var ga = g.ctx;
            var percent = this.hp / 100;
            var offset_hp = 250;

            ga.fillStyle = "grey";
            ga.fillRect(g.canvas.width/2+offset_hp,2, 100, 20);

            ga.fillStyle = "red";
            ga.fillRect(g.canvas.width/2+offset_hp,2, 100 * percent, 20);

            ga.fillStyle = "white";
            ga.font = "20px sans-serif";
            ga.fillText("HP ", g.canvas.width/2+offset_hp+30, 20);

            percent = this.player.energy / 100;
            var offset_nrg = 320;

            ga.fillStyle = "grey";
            ga.fillRect(g.canvas.width/ 2-offset_nrg,2, 100, 20);

            ga.fillStyle = "#1569C7";
            ga.fillRect(g.canvas.width/  2-offset_nrg,2, 100 * percent, 20);

            ga.fillStyle = "white";
            ga.font = "20px sans-serif";
            ga.fillText("NRG ", g.canvas.width / 2-offset_nrg+30, 20);


            ga.fillStyle = "white";
            ga.font = "25px sans-serif";
            ga.fillText("SCORE: " + this.score, g.canvas.width / 2-50, 20);

            // draw all asteroids and bullets
            for (var i = 0; i < this.asteroids.length; i++) {
                this.asteroids[i].draw(g);
            }
            for (var i = 0; i < this.bullets.length; i++) {
                this.bullets[i].draw(g);
            }

            // draw ship
            this.player.draw(g);

            if(this.gameOver){
                ga.fillStyle = "yellow";
                ga.font = "50px sans-serif";
                var s ="GAME OVER\n\npush spacebar";
                g.fillTextMultiLine(s,g.canvas.width/2-(s.length+100),100, g.canvas.height/2-20);
            }

        }
    });