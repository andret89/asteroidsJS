function Game(width, height) {

    this.width = width;
    this.height = height;

    var requestId = 0;
    var p = new Asteroid(Points.ASTEROIDS[2], 10, 50, 20);
    p.maxX = this.width;
    p.maxY = this.height;
    log(p);
    var o = new Asteroid(Points.ASTEROIDS[1], 20, 80, 100);
    o.maxX = this.width;
    o.maxY = this.height;
    log(o);
    var player = new ship(this.width, this.height);
    var canvas = new Canvas(this.width, this.height);
    log(canvas);

    // ... cose definite nella lezione precedente

    function update() {
        canvas.clearAll();
        p.update()
        o.update()
        player.update()
    }

    function collisionDetect(a, b) {
        if (a.collision(b)) {
            a.color = 'red';
            log("collision")
        } else
            a.color = 'white';
    }

    function draw() {
        p.draw(canvas)
        o.draw(canvas)
        collisionDetect(player, o)
        collisionDetect(player, p)
        player.draw(canvas)

        //        p.debug(canvas)
    }

    function gameLoop(time) {
        // aggiorna tutti gli oggetti
        update();
        //disegna l'intera scena a schermo
        draw();
        requestId = window.requestAnimationFrame(gameLoop);
    }

    function stop() {
        if (requestId)
            window.cancelAnimationFrame(requestId);
        requestId = 0;
    }

    Game.animate = function() { gameLoop() }
    Game.stop = function() { stop() }

}