/**
 * Canvas
 * 
 * Canvas class, meant to make life easier by abstracting out
 * rendering and animation code
 * 
 * @param  {number} width  width of the canvas
 * @param  {number} height height of the canvas
 */
function Canvas(param) {
    var canvas_id = param.canvasId || "canvasGen"
    this.w = param.width || 800;
    this.h = param.height || 600;
    // create and set dimension of internal canvas
    if (canvas_id === "canvasGen") {
        this.canvas = document.createElement(canvas_id);
        document.body.appendChild(this.canvas);
    } else {
        this.canvas = document.getElementById(canvas_id);
    }
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    //nasconde il cursore
    //this.canvas.style.cursor = "none";

    // create augmented drawing context
    this.ctx = this.canvas.getContext("2d");
    //context 2d
    if (!this.ctx) {
        alert("Il tuo browser non supporta HTML5, aggiornalo!");
    }
    // useful additional fields for convenice and quicker
    // computations
    this.ctx.width = this.w;
    this.ctx.height = this.h;
    this.width = this.w;
    this.height = this.h;
}

Canvas.prototype = {
    toString: function() {
        return ("Canvas w:" + this.canvas.width + " , h:" + this.canvas.height)
    },
    /**
     * Draws a polygon object
     * 
     * @param  {Polygon} Polygon the polygon to draw
     * @param  {number}  x the x coordinate
     * @param  {number}  y draw y coordinate
     */
    drawPolygon: function(polygon, x, y) {
        // NOTE: this => ctx
        var g = this.ctx,
            p = polygon.points;
        // iterate thru all points and draw with stroke style
        g.beginPath();
        g.strokeStyle = p.color || "white";
        g.moveTo(p[0].x + x, p[0].y + y);
        for (var i = 1; i < p.length - 1; i++)
            g.lineTo(p[i].x + x, p[i].y + y);
        g.closePath()
        g.stroke()
        if (DEBUG) {
            var b = polygon.getBox()
            this.drawCircle(b, polygon.x, polygon.y)
        }
    },
    /**
     * Clears the complete canvas
     */
    clearAll: function() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    },
    drawCircle: function(c, x, y) {
        var g = this.ctx
        g.beginPath();
        g.strokeStyle = c.color || "red";
        g.arc(c.center.x + x, c.center.y + y, c.radius, 0, 2 * Math.PI, false);
        g.closePath();
        g.stroke()
    },
    drawLine: function(x1, y1, x2, y2, color) {
        var g = this.ctx
        g.beginPath();
        g.strokeStyle = color || "green";
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
    }
}