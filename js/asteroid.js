/**
 * @param  {number} x      - posizione in coordinate x
 * @param  {number} y      - posizione in coordinate y
 * @param  {number} size   - dimensione dell'asteroide
 * @param  {Canvas} parent - componente per il disegno
 * @param  {number} difficultly - livello di difficoltà
 * @class Rappresenta un Asteroide
 * @extends GameObj
 */
var Asteroid = GameObj.extend(
  /**
   * @constructor
   */
  function Asteroid (x, y, size, parent, difficultly) {
    GameObj.call(this, x, y, size, parent)
    this.type = 'Asteroid'
    this.color = 'grey'
    this.img = new Image()
    this.img.src = 'img/aster.png'
    var sizeAsteroid = 10


    // imposta l'angolo di rotazione utilizzato in ogni aggiornamento
    this.rotation = 0.02 * (Math.random() * 2 - 1)
    this.angle = this.rotation

    var massTemp = 4
    if (size === sizeAsteroid / 2)
      massTemp = 2
    else if (size === sizeAsteroid / 4)
      massTemp = 1

    this.mass = massTemp

    var maxSpeed = 120 + 20 * difficultly
    var minSpeed = 60
    this.checkMaxSpeed = false;

    // calcolare la velocità
    var r = Math.PI * Math.random()
    var v = Math.randInt(maxSpeed, minSpeed)
    var vx = v
    var vy = v

    if (Math.random() > 0.5)
      vx *= -1

    if (Math.random() > 0.5)
      vy *= -1

    this.vx = vx * Math.cos(r)
    this.vy = vy * Math.sin(r)
  }, {
    /**
     * Aggiornamento posizione e rotazione
     * @param dt
     */
    update: function (dt) {
      // aggiornameto per il ridimenzionamento
      var canvasWidth = this.parent.width
      var canvasHeight = this.parent.height

      if (this.checkMaxSpeed) {
        if (this.vx > this.maxSpeed) {
          this.vx = this.maxSpeed
        }
        if (this.vx < -this.maxSpeed) {
          this.vx = -this.maxSpeed
        }
        if (this.vy > this.maxSpeed) {
          this.vy = this.maxSpeed
        }
        if (this.vy < -this.maxSpeed) {
          this.vy = -this.maxSpeed
        }
      }

      // aggioranemto posizione secondo la velocità
      this.x += this.vx * dt
      this.y += this.vy * dt

      // movimento player nel canvas
      if (this.x > canvasWidth)
        this.x = 0
      else if (this.x < 0)
        this.x = canvasWidth

      if (this.y > canvasHeight)
        this.y = 0
      else if (this.y < 0)
        this.y = canvasHeight

      this.angle += this.rotation
    },
    /**
     * Disegna un asteroide
     *
     * @param  {Canvas} g - oggetto per disegnare sul canvas
     */
    draw: function (g) {
      g.drawAsteroid(this, this.x, this.y)
      if (Main.DEBUGBOX) {
        var bbox = this.getBox()
        g.drawBbox(bbox.x, bbox.y, bbox.radius)
        g.drawVelocity(this)
      }
    },
    getBox: function () {
      return {
        x: this.x,
        y: this.y,
        radius: this.radius
      }
    },
    /**
     * Verifica se c'è collisione con un missile
     * @param {number} x - coordinate x
     * @param {number} y - coordinate y
     * @returns {Bollean} Risultato test di collisione
     */
    isCollision: function (x, y) {
      return this.hitTestCircle(x, y)
    },
    elasticCollision:function(aster){

            if (!this.hitTestCircle(aster.x, aster.y, aster.radius)) 
                return; 
            
            this.shiftPos(aster);

            var ball1 = this; 
            var ball2 = aster 
            var dx = ball1.x - ball2.x; 
            var dy = ball1.y - ball2.y; 
            var dvx = ball1.vx * ball1.vx + ball1.vy * ball1.vy; 
            var dvy = ball2.vx * ball2.vx + ball2.vy * ball2.vy; 
 
 
            //find the angle of the collision 
            var collisionision_angle = Math.atan2(dy, dx); 
 
            // module velocity 
            var speed1 = Math.sqrt(dvx); 
            var speed2 = Math.sqrt(dvy); 
 
            var direction_1 = Math.atan2(ball1.vy, ball1.vx); 
            var direction_2 = Math.atan2(ball2.vy, ball2.vx); 
 
            var 
 
                new_xspeed_1 = speed1 * Math.cos(direction_1 - collisionision_angle), 
                new_yspeed_1 = speed1 * Math.sin(direction_1 - collisionision_angle), 
                new_xspeed_2 = speed2 * Math.cos(direction_2 - collisionision_angle), 
                new_yspeed_2 = speed2 * Math.sin(direction_2 - collisionision_angle), 
 
                final_xspeed_1 = ((ball1.mass - ball2.mass) * new_xspeed_1 + 
                    (ball2.mass + ball2.mass) * new_xspeed_2) / (ball1.mass + ball2.mass), 
                final_xspeed_2 = ((ball1.mass + ball1.mass) * new_xspeed_1 + 
                    (ball2.mass - ball1.mass) * new_xspeed_2) / (ball1.mass + ball2.mass), 
                final_yspeed_1 = new_yspeed_1, 
                final_yspeed_2 = new_yspeed_2, 
 
                /* 
                 cosAngle = Math.cos(collisionision_angle), 
                 sinAngle = Math.sin(collisionision_angle); 
 
 
                 ball1.vx = cosAngle * final_xspeed_1 - sinAngle * final_yspeed_1; 
                 ball1.vy = sinAngle * final_xspeed_1 + cosAngle * final_yspeed_1; 
                 ball2.vx = cosAngle * final_xspeed_2 - sinAngle * final_yspeed_2; 
                 ball2.vy = sinAngle * final_xspeed_2 + cosAngle * final_yspeed_2; 
                 */ 
                cosAngle = Math.cos(collisionision_angle), 
                cosAngle2 = Math.cos(collisionision_angle + Math.PI / 2), 
                sinAngle = Math.sin(collisionision_angle), 
                sinAngle2 = Math.sin(collisionision_angle + Math.PI / 2); 
 
 
            ball1.vx = cosAngle * final_xspeed_1 + cosAngle2 * final_yspeed_1; 
            ball1.vy = sinAngle * final_xspeed_1 + sinAngle2 * final_yspeed_1; 
            ball2.vx = cosAngle * final_xspeed_2 + sinAngle2 * final_yspeed_2; 
            ball2.vy = sinAngle * final_xspeed_2 + cosAngle2 * final_yspeed_2; 

    },
    shiftPos:function(aster){
        var ball1 = this;
        var ball2 = aster;
        if (ball1.x < ball2.x)
        {
          ball1.x -= 1;
          ball2.x += 1;
        }
        else
        {
          ball1.x += 1;
          ball2.x -= 1;
        }
 
        if (ball1.y < ball2.y)
        {
          ball1.y -= 1;
          ball2.y += 1;
        }
        else
        {
          ball1.y += 1;
          ball2.y -= 1;
        }
    }
  }
);
