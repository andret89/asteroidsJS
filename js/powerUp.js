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
    function PowerUp(x, y, size, type, parent) {
        GameObj.call(this, x, y, size, parent);
        this.color = "green";
        this.type = type;
        this.selected = false;
        this.img = new Image();
        this.img.src = this.getImgBonus(type);

        this.startTime = new Date().getTime();
        this.timeOut = 11000;
    },
    {
        getImgBonus:function(type){
            var img;
            switch (type){
                case "hp":
                    img = "img/bonus-hp.png";
                    this.bonus = 250;
                    break;
                case "nrg":
                    img = "img/bonus-nrg.png";
                    this.bonus = 100;
                    break;
                case "score":
                    img = "img/bonus-score.png";
                    this.bonus = 500;
                    break;
            }
            return img;
        },
        update:function () {
            if(new Date().getTime() - this.startTime > this.timeOut ){
                this.active = false;
            }
        },
        draw:function (g) {
            g.drawAsteroid(this,this.x,this.y)
        },
        hitTest: function(x, y) {
            return this.hitTestCircle(x, y);
        }
    }
);
