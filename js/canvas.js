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
        var g = this.ctx;
        g.beginPath();
        //var tmp=g.lineWidth;
        //g.lineWidth = 3;

        /*
        ga.shadowOffsetX = 2;
        ga.shadowOffsetY = 2;
        */
        g.save();
        g.shadowBlur = 35;
        g.globalAlpha = 0.1;
        g.shadowColor = g.fillStyle = c.color || "red";
        g.arc(c.center.x + x, c.center.y + y, c.radius, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.restore();
    },
    /**
     *
     * @param x
     * @param y
     * @param r
     */
    drawCircleBox: function (x, y, r) {
        var g = this.ctx;
        g.beginPath();
        g.strokeStyle = "yellow";
        var tmp = g.lineWidth;
        g.lineWidth = 1;
        g.arc(x, y, r, 0, 2 * Math.PI, false);
        g.closePath();
        g.stroke();
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
        var size = p.radius * p.size;
        g.drawImage(p.img, -size / 2, -size / 2, size, size);
        if(p.jetFireActive) {
            g.rotate(Math.radians(-5));
            g.shadowBlur = 5;
            g.shadowColor = "white";
            g.drawImage(p.jetFire.img, -size / 2 + p.jetFire.offsetX, -size / 4 + p.jetFire.offsetY, size, size/2);
        }
        if(p.shieldActive){
            g.shadowBlur = 25;
            g.shadowColor = "blue";
            g.globalAlpha = 0.8;
            g.drawImage(p.shield.img, -size / 2 + p.shield.offsetX, -size / 2 + p.shield.offsetY, size, size/2+10);

        }
        g.restore();


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
        var size = p.radius * 4;
        g.drawImage(p.img, -size / 2, -size / 2, size, size);
        g.restore()

    },
    drawEnemy:function (p,x,y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle + Math.radians(90));
        var size = p.radius * 2;
        g.drawImage(p.img, -size / 2, -size / 2, size, size);
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
    drawBullet: function (x1, y1, x2, y2, color) {
        var g = this.ctx;
        g.save();
        g.beginPath();
        g.lineWidth = 3;
        g.shadowBlur = 10;
        g.shadowColor = g.strokeStyle = color || "yellow";
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
        g.restore();
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
    },
    drawVelocity:function(entity) {
        with(this.ctx) {
            strokeStyle = "yellow";
            lineWidth = 1;
            beginPath();
            moveTo(entity.x, entity.y);
            lineTo(entity.x + entity.vx, entity.y + entity.vy);
            stroke();
            closePath();
            fillStyle = "yellow";
            beginPath();
            var x0 = entity.x + entity.vx;
            var y0 = entity.y + entity.vy;
            lineTo(x0, y0);
            var angle = Math.atan2(entity.vy, entity.vx);
            var aperture = Math.PI - Math.PI / 12;
            var len = 10;
            var x1 = x0 + len * Math.cos(angle + aperture);
            var y1 = y0 + len * Math.sin(angle + aperture);
            lineTo(x1, y1);
            var x2 = x0 + len * Math.cos(angle - aperture);
            var y2 = y0 + len * Math.sin(angle - aperture);
            lineTo(x2, y2);
            fill();
            closePath();
        }
    }
};