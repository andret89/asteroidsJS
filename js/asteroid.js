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
    }
  }
);
