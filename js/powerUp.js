/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione bonus
 * @param  {Canvas} parent - componente per il disegno
 * @class Rappresenta un bonus per il Player
 * @extends GameObj
 */
var PowerUp = GameObj.extend(
    /**
     * * @constructor
     */
    function PowerUp(x, y, size, parent) {
        GameObj.call(this, x, y, size, parent);
        this.color = "green";
        this.selected = false;
        this.img = new Image();
        this.img.src = "img/bonus.png";
        this.bonus = 500;
        this.startTime = new Date().getTime();
        this.timeOut = 11000;
    },
    {
        update:function () {
            if(new Date().getTime() - this.startTime > this.timeOut ){
                this.active = false;
            }
        },
        draw:function (g) {
            g.drawAster(this,this.x,this.y)
        },
        hitTest: function(x, y) {
            return this.collisionCircle(x, y);
        }
    }
);
