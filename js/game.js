function Game(width, height) {

    this.width = width;
    this.height = height;

    var requestId = 0;
    var p = new Asteroid(Points.ASTEROIDS[2], 10, 50, 20);
    p.maxX = this.width;
    p.maxY = this.height;
    log(p);
    var o = new Polygon(Points.ASTEROIDS[2]);
    log(o);
    var canvas = new Canvas(this.width, this.height);
    log(canvas);

    // ... cose definite nella lezione precedente

    function update() {
        p.update()
    }

    function draw() {
        p.draw(canvas)
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