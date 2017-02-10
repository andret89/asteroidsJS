/**
 * @class Gestisce le entità in gioco
 * @param {Main} main - gestore gioco
 * @constructor
 */
var Game = function (main) {
    this.type = "Game";
    this.gameOver = false;
    this.screen = main.screen;
    this.main = main;
    this.menu = main.menu;
    this.main.score = 0;
    this.lvl = 1;
    this.n_life = 3;
    this.sizeAsteroid = 10;
    this.sizeEnemy = 8;
    this.timeLastBonusNrg = this.timeLastBonusScore =
        this.timeLastBonusHp  = new Date().getTime();
    this.timeLastEnemy = 0;
    this.timeSpawnBonus = 10000;
    this.timeSpawnEnemy = 60000;

    this.debug = false;

    this.player = new Player(
        this.screen.width / 2, // x
        this.screen.height / 2, // y
        6, //size
        this.screen // parent
    );
};
Game.prototype = {
    /**
     * Genera un nuovo livello di gioco
     */
    genLevel: function () {
        this.bullets = []; // missili del giocatore
        this.asteroids = []; // asteroidi in gioco
        this.bonus = []; // bonus per il giocatore
        this.enemies = []; // nemici

        // n di asteroidi secondo il livello attuale
        var n_asteroids = Math.round(this.main.levelDifficulty + (this.lvl / 4));
        for (var i = 0; i < n_asteroids; i++) {

            // definisce la posizione del asteroide nel canvas in modo casuale
            var x = 0,
                y = 0,
                randomPos = (Math.random() > 0.5);
            if (randomPos)
                x = Math.random() * this.screen.width;
            else
                y = Math.random() * this.screen.height;

            var aster = new Asteroid(
                x,
                y,
                this.sizeAsteroid,
                this.screen,
                this.main.levelDifficulty
            );
            this.asteroids.push(aster);
        }
    },
    /**
     * Aggiorna gli oggetti in caso di collisioni
     * @param {Asteroids} a - asterode che collide
     */
    updateScore: function (a) {
        // aggiorna il puntaggio se il giocatore è attivo
        // il punteggio assegnato dipende dalla dim dell'astreroide distrutto
        if (this.player.active) {
            switch (a.size) {
                case this.sizeAsteroid:
                    this.main.score += 20;
                    break;
                case this.sizeAsteroid / 2:
                    this.main.score += 50;
                    break;
                case this.sizeAsteroid / 4:
                    this.main.score += 100;
                    break;
            }
        }

        // se l'asteoride è stato colpito al massimo 2 volte
        // viene diviso altrimenti viene eliminato
        if (a.size > this.sizeAsteroid / 4) {
            for (var k = 0; k < 2; k++) {

                var astr = new Asteroid(
                    a.x,
                    a.y,
                    a.size / 2,
                    this.screen,
                    this.main.levelDifficulty
                );
                this.asteroids.push(astr);
            }
        }
    },
    init: function () {
        this.genLevel();

    },
    /**
     * Aggiorna gli oggetti in gioco secondo gli input e il tick del tempo
     * @param input
     * @param dt
     */
    update: function (input, dt) {
        // verifica i comandi impartiti dell'utente
        // e aggiorna lo stato di conseguenza
        if (input.isPressed('KEY_ESC') || input.isPressed('KEY_P')) {
            log("pause");
            this.main.menu.enableOptions();
            return;
        }
        if (input.isPressed('KEY_M')) {
            Main.MUTE = !Main.MUTE;
        }

        if (input.isPressed('KEY_G')) {
            Main.DEBUGBOX = !Main.DEBUGBOX;
        }

        this.player.shieldActive = false;

        if (!this.player.active) {
            if (input.isPressed("KEY_SPACE")) {
                this.player.active = true;
                this.player.x = this.screen.width / 2;
                this.player.y = this.screen.height / 2;
                this.player.vel = {x: 0, y: 0};
            }
        }
        else {
            if (input.isDown('KEY_UP') || input.isDown('KEY_W')) {
                this.player.addSpeed();
                this.main.sm.playSound('fire')
            }
            if (input.isDown('KEY_DOWN') || input.isDown('KEY_S')) {
                if (this.player.energy >= 10)
                    this.player.shieldActive = true;
            }
            if ((input.isPressed('KEY_DOWN') || input.isPressed('KEY_S'))) {
                this.main.sm.playSound('shield');
            } else if (!this.player.shieldActive)
                this.main.sm.stopSound('shield');

            if (input.isDown('KEY_RIGHT') || input.isDown('KEY_D')) {
                this.player.addDirection(Math.radians(4));
            }
            if (input.isDown('KEY_LEFT') || input.isDown('KEY_A')) {
                this.player.addDirection(Math.radians(-4));
            }
            if (input.isPressed('KEY_ALT') || input.isPressed('KEY_SPACE')) {
                if (this.player.energy >= 10) {
                    var b = this.player.addBullet(this.bullets);
                    if (b) {
                        this.main.sm.playSound('shoot');
                    }
                }
            }
            if(input.isPressed('KEY_CTRL')){
                if(this.player.energy==100) {
                    this.player.fullLaser(this.bullets);
                    this.main.sm.playSound('shoot');
                }
            }
        }
        var self = this;
        this.asteroids.forEachOptimized(function (a) {
            a.update(dt);

            // verifica se i missili colpiscono un asteroide
            self.bullets.forEachOptimized(function (b) {
                if (!b.isEnemy && a.active && a.isCollision(b.x, b.y)) {
                    if(self.player.powerLaser)
                        log("power")
                    b.active = false;
                    a.active = false;
                    self.main.sm.playSound('explosion');
                    self.updateScore(a)
                }
            });

            self.asteroids.forEachOptimized(function (b) {
                if(a !== b && b.active && a.collisionCircle(b.x,b.y,b.radius)){
                    b.elasticCollision(a);
                }

            });
            // se il player collide con un astreroide e lo scudo non è attivo
            // viene riposizionato al centro dello schermo
            // e decrementa la  sua vita
            if (a.active && self.player.isCollision(a)) {
                self.main.sm.playSound('explosion');
                if (!self.player.shieldActive) {
                    self.player.active = false;
                    self.player.hp -= 100 / self.n_life;
                }
                self.updateScore(a);
                a.active = false;
            }

            if (self.player.hp <= 0) {
                self.gameOver = true;
            }
        });

        // se gli astoridi sono stati tutti distrutti si avenza di livello
        if (this.asteroids.length === 0 &&
            this.bonus.length === 0 && this.enemies.length === 0) {
            this.lvl++;
            if (this.player.hp < 100)
                this.player.hp += 100 / this.n_life;
            self.genLevel();
        }

        this.player.update(dt);

        // aggiorna solo i missili attivi
        // gli altri vengono eliminati
        this.bullets = self.bullets.filter(function (b) {
            var _active = b.active;
            if (_active)
                b.update(dt);

            if(b.isEnemy &&  self.player.isCollision(b)){
                if(!self.player.shieldActive) {
                    self.player.active = false;
                    self.player.hp -= 100 / self.n_life;
                    self.main.sm.playSound('explosion');
                }
                b.active = false;

            }
            self.enemies.forEachOptimized(function (e) {
                if(!b.isEnemy && e.isCollision(b.x,b.y)){
                    e.hp -= 100/3;
                    if(e.hp <= 0) {
                        e.active = false;
                        self.main.score += e.score;
                        self.main.sm.playSound('explosion');
                        _active = false;
                    }
                }
            });
            return _active;
        });

        this.enemies = self.enemies.filter(function (e) {
            e.update(dt);
            var _active = e.active;

            if (_active) {
                if(e.nearTarget()) {
                    var b = e.tryShoot();
                    if (b) {
                        self.bullets.push(b);
                        self.main.sm.playSound('shoot');
                    }
                }

                if (self.player.isCollision(e)) {
                    self.player.active = false;
                    self.player.hp -= 100 / self.n_life;
                    self.main.sm.playSound('explosion');
                    _active = false;
                }
            }
            return _active;
        });

        // elimina gli asteroidi colpiti
        this.asteroids = self.asteroids.filter(function (a) {
            return a.active;
        });
        // se fine gioco il prossimo stato è game over
        if (this.gameOver) {
            this.main.menu.setVisibility("resumeGame", 'none');
            this.main.menu.setVisibility("startGame", 'block');
            this.main.nextState = States.GAMEOVER;
        }

        var now = new Date().getTime();


        this.bonus = self.bonus.filter(function (b) {
            b.update();
            var _active = b.active;
            if (_active && !b.selected && self.player.isCollision(b)) {
                _active = false;
                self.main.score += b.bonus;
                switch (b.type) {
                    case "hp":
                        self.player.hp = 100;
                        break;
                    case "score":
                        self.player.powerLaser = true;
                        self.player.startPowerLaser = now;
                        break;

                    case "nrg":
                        self.player.energy = 100;
                        self.player.powerLaser = true;
                        self.player.startPowerLaser = now;
                        break;
                }
            }
            return _active;
        });



        if (this.asteroids.length > 1) {

            if (now - this.timeLastBonusHp > this.timeSpawnBonus * 3) {
                this.addBonus("hp", 4);
                this.timeLastBonusHp = now;
            }
            else if (now - this.timeLastBonusScore > this.timeSpawnBonus * 2) {
                this.addBonus("score", 2);
                this.timeLastBonusScore = now;
            } else if (now - this.timeLastBonusNrg > this.timeSpawnBonus) {
                this.addBonus("nrg", 4);
                this.timeLastBonusNrg = now;
            }
        }
        if (now - this.timeLastEnemy > this.timeSpawnEnemy) {
            // TODO start position bug
            var x = 30,
                y = 30,
                randomPos = (Math.random() > 0.5);
            if (randomPos)
                x = Math.randInt(30, this.screen.width - 30);
            else
                y = Math.randInt(30, this.screen.height - 30);

            this.enemies.push(new Enemy(
                x,
                y,
                this.sizeEnemy,
                this.screen,
                this.main.levelDifficulty,
                this.player
            ));
            this.timeLastEnemy = now;


        }

    },
    addBonus: function (type, size) {
        if (!Main.paused) {
            this.bonus.push(new PowerUp(
                Math.randInt(10, this.screen.width - 10),
                Math.randInt(10, this.screen.height - 10),
                size,
                type,
                this.screen
            ));
            this.timeSpawnBonus += Math.randInt(0, 35000);
        }
    },
    /**
     * Disegna le entità in gioco
     * @param  {Canvas} g - oggetto per disegnare sul canvas
     */
    draw: function (g) {
        if (this.menu.activeInfo || this.menu.activeDifficultly) {
            return;
        }

        // disegna progressbar dell'energia e dalla vita

        var ga = g.ctx;
        var percent = this.player.hp / 100;
        var barWidth = 150;
        var barHeight = 20;
        var offset_top = g.canvas.offsetTop + 10;
        var offset_hp = g.canvas.width - barWidth - 50;

        ga.fillStyle = "grey";
        ga.fillRect(offset_hp + 30, offset_top, barWidth, barHeight);
        ga.fillStyle = "red";
        ga.fillRect(offset_hp + 30, offset_top, barWidth * percent, barHeight);
        ga.fillStyle = "white";
        ga.font = "20px sans-serif";
        ga.fillText("HP ", offset_hp, offset_top + 18);

        percent = this.player.energy / 100;
        var offset_nrg = 80;

        ga.fillStyle = "grey";
        ga.fillRect(offset_nrg, offset_top, barWidth, barHeight);
        ga.fillStyle = "#1569C7";
        ga.fillRect(offset_nrg, offset_top, barWidth * percent, barHeight);
        ga.fillStyle = "white";
        ga.font = "20px sans-serif";
        ga.fillText("NRG ", offset_nrg - 45, offset_top + 18);


        ga.fillStyle = "white";
        ga.font = "30px sans-serif";
        var s = "Liv: " + this.lvl + "  SCORE: ";
        ga.fillText(s + this.main.score, g.canvas.width / 2 - (s.length + 70), offset_top + 18);


        this.asteroids.forEachOptimized(function (a) {
            a.draw(g)
        });

        this.bullets.forEachOptimized(function (b) {
            b.draw(g);
        });

        this.enemies.forEachOptimized(function (b) {
            b.draw(g);
        });


        this.player.draw(g);


        this.bonus.forEachOptimized(function (b) {
            b.draw(g);
        });


        /// se il player ha avuto una collisione
        // informa l'utente sulle azioni da compiere per riprendere il gioco
        if (!this.player.active) {

            ga.fillStyle = "white";
            ga.font = "25px sans-serif";
            ga.fillText("Push spacebar for continue ", g.canvas.width / 2 - 150, g.canvas.height / 2);
        }

    }

};