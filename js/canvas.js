/**
 * Canvas
 * 
 * Canvas class, meant to make life easier by abstracting out
 * rendering and animation code
 * 
 * @param  {number} width  width of the canvas
 * @param  {number} height height of the canvas
 */
function Canvas(width, height) {
    this.width = width;
    this.height = height;
    // create and set dimension of internal canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    //nasconde il cursore
    this.canvas.style.cursor = "none";
    document.body.appendChild(this.canvas);

    // create augmented drawing context
    this.ctx = this.canvas.getContext("2d");
    //context 2d
    if (!this.ctx) {
        alert("Il tuo browser non supporta HTML5, aggiornalo!");
    }

    // useful additional fields for convenice and quicker
    // computations
    this.ctx.width = width;
    this.ctx.height = height;

    this.toString = function() {
            return ("Canvas w:" + this.canvas.width + " , h:" + this.canvas.height)
        }
        /**
         * Draws a polygon object
         * 
         * @param  {Polygon} p the polygon to draw
         * @param  {number}  x the x coordinate
         * @param  {number}  y draw y coordinate
         */
    this.drawPolygon = function(p, x, y) {
            // NOTE: this => ctx

            p = p.points;
            // iterate thru all points and draw with stroke style
            this.ctx.beginPath();
            this.ctx.moveTo(p[0] + x, p[1] + y);
            for (var i = 2, len = p.length; i < len; i += 2) {
                this.ctx.lineTo(p[i] + x, p[i + 1] + y);
            }
            this.ctx.strokeStyle = "white";
            this.ctx.stroke();
        }
        /**
         * Clears the complete canvas
         */
    this.clearAll = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }



}