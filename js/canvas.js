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
    var h = height ||  window.innerHeight;
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
        alert("Il tuo browser non supporta HTML5, aggiornalo!");
    }
    _canvas.width = w;
    _canvas.height = h;
    this.canvas = _canvas;
    this.ctx.width = w;
    this.ctx.height = h;
    this.width = w;
    this.height = h;
    var self= this;
    window.addEventListener('resize', function(evt) {
        //TODO resize
        self.canvas.width = window.innerWidth;
        self.canvas.height = window.innerHeight;
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.ctx.width = window.innerWidth;
        self.ctx.height = window.innerHeight;
        log("resize")
    });
}

Canvas.prototype = {
    toString: function () {
        return ("Canvas w:" + this.canvas.width + " , h:" + this.canvas.height)
    },
    /**
     * Draws a polygon object
     *
     * @param  {Polygon} Polygon the polygon to draw
     * @param  {number}  x the x coordinate
     * @param  {number}  y draw y coordinate
     */
    drawPolygon: function (polygon, x, y) {
        // NOTE: this => ctx
        var g = this.ctx,
            p = polygon.points;
        // iterate thru all points and draw with stroke style
        g.save()
        g.beginPath();
        g.strokeStyle = polygon.color || "white";
        //g.translate(x, y);
        g.moveTo(p[0].x+x, p[0].y+y);
        for (var i = 1; i < p.length; i++)
            g.lineTo(p[i].x+x, p[i].y+y)
        g.stroke()
        g.restore()

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
        g.strokeStyle = c.color || "red";
        g.arc(c.center.x + x, c.center.y + y, c.radius, 0, 2 * Math.PI, false);
        g.closePath();
        g.stroke()
    },
    drawLine: function (x1, y1, x2, y2, color) {
        var g = this.ctx
        g.beginPath();
        g.strokeStyle = color || "green";
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
    }
}