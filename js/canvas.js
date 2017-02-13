/**
 * @class Rappresenta la finestra di disegno
 * @param  {number} width - lunghezza del canvas
 * @param  {number} height - altezza del canvas
 * @param  {string} canvasId - id dell'elemento canvas
 * @constructor
 */
function Canvas(width, height, canvasId) {
    var canvas_id = canvasId || "canvasId";
    var w = width || window.innerWidth;
    var h = height || window.innerHeight;

    // crea o recupera l'elemento canvas
    var _canvas = document.getElementById(canvas_id);
    if (_canvas === null) {
        _canvas = document.createElement('canvas');
        _canvas.id = canvas_id;
        document.getElementById("gameContainer").appendChild(_canvas);
    }

    // recupera il contesto 2d del canvas
    this.ctx = _canvas.getContext("2d");
    if (!this.ctx) {
        alert("Il tuo browser non supporta HTML5");
    }

    this.ctx.lineWidth = 2;
    this.ctx.imageSmoothingEnabled = true;

    // setta le dimensioni della finestra di disegno
    this.width = _canvas.width = w;
    this.height = _canvas.height = h;
    this.canvas = _canvas;

    var self = this;
    // gestione evento di ridimenzionamento della finestra
    window.addEventListener('resize', function(evt) {
        self.width = self.canvas.width = window.innerWidth;
        self.height = self.canvas.height = window.innerHeight;
    });
}

Canvas.prototype = {
    /**
     * Pulisce la schermo per il ridisegno
     */
    clearAll: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    /**
     * Disegna il bbox
     * @param cx {number}  coordinata x del centro
     * @param cy {number}  coordinata y del centro
     * @param r {number} raggio dal centro
     */
    drawBbox: function(cx, cy, r) {
        var g = this.ctx;
        g.save();
        g.beginPath();
        g.strokeStyle = "yellow";
        var tmp = g.lineWidth;
        g.lineWidth = 1;
        g.translate(cx,cy);
        g.arc(0, 0, r, 0, 2 * Math.PI, false);
        g.closePath();
        g.stroke();
        g.lineWidth = tmp;
        g.restore();
    },
    /**
     * Disegna un gicatore ruotato nel punto centrale
     * @param p {Player} giocatore
     * @param x {number} coordinata x del centro
     * @param y {number} coordinata y del centro
     */
    drawPlayer: function(p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle + Math.radians(90));
        var size = p.radius * p.size;
        g.drawImage(p.img, -size / 2, -size / 2, size, size);
        if (p.jetFireActive) {
            g.rotate(Math.radians(-5));
            g.shadowBlur = 5;
            g.shadowColor = "white";
            g.drawImage(p.jetFire.img, -size / 2 + p.jetFire.offsetX, -size / 4 + p.jetFire.offsetY, size, size / 2);
        }
        if (p.shieldActive) {
            g.shadowBlur = 25;
            g.shadowColor = "blue";
            g.globalAlpha = 0.8;
            g.drawImage(p.shield.img, -size / 2 + p.shield.offsetX, -size / 2 + p.shield.offsetY, size, size / 2 + 10);

        }
        g.restore();


    },
    /**
     * Disegna un asteroide ruotato nel punto centrale
     * @param p {Asteroid} asteroide
     * @param x {number} coordinata x del centro
     * @param y {number} coordinata y del centro
     */
    drawImageCircle: function(p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle);
        var size = p.radius * 4;
        g.drawImage(p.img, -size / 2, -size / 2, size, size);
        g.restore()

    },
    /**
     * Disegna un nemico ruotato nel punto centrale
     * @param p {Enemy} nemico
     * @param x {number} coordinata x del centro
     * @param y {number} coordinata y del centro
     */
    drawEnemy: function(p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle + Math.radians(90));
        var size = p.radius * 2;
        g.drawImage(p.img, -size / 2, -size / 2, size, size);
        g.restore()
    },
    /**
     *Disegna un missile
     */
    drawBullet: function(bullet) {
        var g = this.ctx,
            x1=bullet.x,
            y1=bullet.y,
            x2=bullet.oldx,
            y2=bullet.oldy;

        g.save();
        g.beginPath();
        g.lineWidth = 3;
        g.shadowBlur = 10;
        g.shadowColor = g.strokeStyle = bullet.color || "yellow";
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
        g.restore();
    },
    /**
     * Disegna un testo su piu righe
     */
    fillTextMultiLine: function(text, x, y) {
        var lineHeight = this.ctx.measureText("M").width * 1.2;
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            this.ctx.fillText(lines[i], x, y);
            y += lineHeight;
        }
    },
    /**
     * Disegna il vettore della velocita
     */
    drawVelocity: function(entity) {
        with(this.ctx) {
            strokeStyle = "yellow";
            lineWidth = 1;
            beginPath();
            moveTo(entity.x, entity.y);
            lineTo(entity.x + entity.vx, entity.y + entity.vy);
            stroke();
            closePath();
        }
    }
};