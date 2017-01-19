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
    this.width =_canvas.width = w;
    this.height =_canvas.height = h;
    this.canvas = _canvas;

    var self = this;
    // gestione evento di ridimenzionamenbto della finestra
    window.addEventListener('resize', function (evt) {
        self.width = self.canvas.width = window.innerWidth;
        self.height = self.canvas.height = window.innerHeight;
    });
}

Canvas.prototype = {
    /**
     * Pulisce la finestra da disegno
     */
    clearAll: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    /*

     */
    drawCircle: function (c, x, y) {
        var g = this.ctx
        g.beginPath();
        g.fillStyle = c.color || "red";
        //var tmp=g.lineWidth;
        //g.lineWidth = 3;
        g.arc(c.center.x + x, c.center.y + y, c.radius, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill()
        //g.lineWidth = tmp;
    },
    /**
     *
     * @param x
     * @param y
     * @param r
     */
    drawCircleBox: function (x, y, r) {
        var g = this.ctx
        g.beginPath();
        g.strokeStyle = "yellow";
        var tmp = g.lineWidth;
        g.lineWidth = 1;
        g.arc(x, y, r, 0, 2 * Math.PI, false);
        g.closePath();
        g.stroke()
        g.lineWidth = tmp;
    },
    /**
     *
     * @param p
     * @param x
     * @param y
     */
    drawPlayer: function (p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle + Math.radians(90));
        var r = p.radius * p.size;
        g.drawImage(p.img, -r / 2, -r / 2, r, r);
        if(p.jetFireActive) {
            g.rotate(Math.radians(-5));
            g.drawImage(p.jetFire.img, -r / 2 + p.jetFire.offsetX, -r / 4 + p.jetFire.offsetY, r, r/2);
        }
        g.restore()

    },
    /**
     *
     * @param p
     * @param x
     * @param y
     */
    drawAster: function (p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle);
        var r = p.radius * 4;
        g.drawImage(p.img, -r / 2, -r / 2, r, r);
        g.restore()

    },
    /**
     *
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param color
     */
    drawLine: function (x1, y1, x2, y2, color) {
        var g = this.ctx;
        g.beginPath();
        g.strokeStyle = color || "green";
        var tmp = g.lineWidth;
        g.lineWidth = 3;
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
        g.lineWidth = tmp;

    },
    /**
     *
     * @param text
     * @param x
     * @param y
     */
    fillTextMultiLine: function (text, x, y) {
        var lineHeight = this.ctx.measureText("M").width * 1.2;
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            this.ctx.fillText(lines[i], x, y);
            y += lineHeight;
        }
    }
};