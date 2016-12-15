function Game(width, height) {

    this.width = width;
    this.height = height;


    var p = new Asteroid(Points.ASTEROIDS[0], 10, 50, 20);
    p.maxX = this.width;
    p.maxY = this.height;
    log(p);
    var o = new Polygon(Points.ASTEROIDS[2]);
    log(o);
    var canvas = new Canvas(this.width, this.height);
    log(canvas);

    // ... cose definite nella lezione precedente


    this.gameLoop = function() {

        if (!this.paused) {

            // aggiorna tutti gli oggetti
            this.update();
        }

        //disegna l'intera scena a schermo
        this.draw();

        window.requestAnimFrame(function() {

            // rilancia la funzione GameLoop ad ogni frame
            game.gameLoop();
        });
    }
    this.update = function() {
        p.update()
    }
    this.draw = function() {
        p.draw(canvas)
    }
}