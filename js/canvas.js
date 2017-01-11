/**
 * Canvas
 *
 * Canvas class, meant to make life easier by abstracting out
 * rendering and animation code
 *
 * @param  {number} width  width of the canvas
 * @param  {number} height height of the canvas
 * @param  {string} id of the canvas
 */
function Canvas(width, height, canvasId) {
    var canvas_id = canvasId || "canvasId";
    var w = width || window.innerWidth;
    var h = height || window.innerHeight;
    // create and set dimension of internal canvas
    var _canvas = document.getElementById(canvas_id);
    if (_canvas === null) {
        _canvas = document.createElement('canvas');
        _canvas.id = canvas_id;
        document.getElementById("gamecontainer").appendChild(_canvas);
    }

    // create augmented drawing context
    this.ctx = _canvas.getContext("2d");
    //context 2d
    if (!this.ctx) {
        alert("Il tuo browser non supporta HTML5");
    }
    _canvas.width = w;
    _canvas.height = h;
    this.canvas = _canvas;
    this.ctx.lineWidth = 2;
    this.ctx.width = w;
    this.ctx.height = h;
    this.width = w;
    this.height = h;
    var self = this;
    window.addEventListener('resize', function (evt) {
        //TODO resize
        self.canvas.width = window.innerWidth;
        self.canvas.height = window.innerHeight;
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.ctx.width = window.innerWidth;
        self.ctx.height = window.innerHeight;
    });
}

Canvas.prototype = {
    /**
     * Draws a polygon object
     *
     * @param  {Polygon} Polygon the polygon to draw
     * @param  {number}  x the x coordinate
     * @param  {number}  y draw y coordinate
     */
    drawStrokePolygon: function (polygon, x, y) {
        // NOTE: this => ctx
        var g = this.ctx,
            p = polygon.points;
        // iterate thru all points and draw with stroke style
        g.save()
        g.beginPath();
        g.strokeStyle = polygon.color || "white";
        g.translate(x, y);
        g.rotate(polygon.angle);
        g.moveTo(p[0].x, p[0].y);
        for (var i = 1; i < p.length; i++)
            g.lineTo(p[i].x, p[i].y)
        g.stroke()
        g.restore()

    },
    drawfillPolygon: function (polygon, x, y) {
        var g = this.ctx,
            p = polygon.points;
        // iterate thru all points and draw with stroke style
        g.save()
        g.beginPath();
        g.strokeStyle = "black";
        g.fillStyle = polygon.color || "white";
        var tmp = g.lineWidth;
        g.lineWidth = 1.5;
        g.translate(x, y);
        g.rotate(polygon.angle);
        g.moveTo(p[0].x, p[0].y);
        for (var i = 1; i < p.length; i++)
            g.lineTo(p[i].x, p[i].y)
        g.fill()
        if (!(polygon instanceof Polygon))
            g.stroke();
        g.restore();
        g.lineWidth = tmp;

    },
    /**
     * Clears the complete canvas
     */
    clearAll: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
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
    drawRectBox: function (x, y, w, h) {
        var g = this.ctx
        g.strokeStyle = "yellow";
        var tmp = g.lineWidth;
        g.lineWidth = 1;
        g.rect(x, y, w, h);
        g.stroke()
        g.lineWidth = tmp;
    },
    drawPlayer: function (p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle + Math.radians(90));
        var r = p.radius * 2;
        g.drawImage(p.img, -r / 2, -r / 2, r, r);
        g.restore()

    },
    drawAster: function (p, x, y) {
        var g = this.ctx;
        g.save();
        g.translate(x, y);
        g.rotate(p.angle);
        var r = p.radius * 4;
        g.drawImage(p.img, -r / 2, -r / 2, r, r);
        g.restore()

    },
    drawLine: function (x1, y1, x2, y2, color) {
        var g = this.ctx
        g.beginPath();
        g.strokeStyle = color || "green";
        var tmp = g.lineWidth;
        g.lineWidth = 3;
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
        g.lineWidth = tmp;

    },
    fillTextMultiLine: function (text, x, y) {
        var lineHeight = this.ctx.measureText("M").width * 1.2;
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            this.ctx.fillText(lines[i], x, y);
            y += lineHeight;
        }
    }
}