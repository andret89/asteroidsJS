var GameObj = function (param) {
        this.parent = param.parent;
        this.size = param.size || 10;
        this.radius = this.size*4;
        this.x = param.x;
        this.y = param.y;
        this.active = true;
        /**
         * Bounds for the asteroid
         */
        this.maxX = param.parent.width;
        this.maxY = param.parent.height;

    };
GameObj.prototype = {
    collisionCircle: function (cx, cy, r) {
        var _r = r || 0; // 0 per distanza da un punto
        return this.distance(this, {x: cx, y: cy}) < this.radius + _r;
    },
    distance: function (ent1, ent2) {
        var dx = ent2.x - ent1.x;
        var dy = ent2.y - ent1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};