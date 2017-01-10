function Point(x, y) {
    this.x = x;
    this.y = y;

    this.addScale = function(v) {
        this.x += v;
        this.y += v;
    }
    this.addPoint = function(other) {
        this.x += other.x;
        this.y += other.y;
    }
}