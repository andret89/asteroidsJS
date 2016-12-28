function ship(width, height) {
    this.position = {
        x: (width / 2),
        y: (height / 2)
    }
    this.movement = {
        x: 0,
        y: 0
    }
    this.bullet = [];
    this.rotation = 0
    this.width = width
    this.height = height
    this.radius = 20
}


ship.prototype.updateRotation = function(p) {
    if (Inputs.pressedKeys.left) {
        this.rotation -= p * 5
    } else if (Inputs.pressedKeys.right) {
        this.rotation += p * 5
    }
}

ship.prototype.updateMovement = function(p) {
    // Behold! Mathematics for mapping a rotation to it's x, y components
    var accelerationVector = {
        x: p * .3 * Math.cos((this.rotation - 90) * (Math.PI / 180)),
        y: p * .3 * Math.sin((this.rotation - 90) * (Math.PI / 180))
    }

    if (Inputs.pressedKeys.up) {
        this.movement.x += accelerationVector.x
        this.movement.y += accelerationVector.y
    } else if (Inputs.pressedKeys.down) {
        this.movement.x -= accelerationVector.x
        this.movement.y -= accelerationVector.y
    } else if (Inputs.pressedKeys.space) {

    }

    // Limit movement speed
    if (this.movement.x > 40) {
        this.movement.x = 40
    } else if (this.movement.x < -40) {
        this.movement.x = -40
    }
    if (this.movement.y > 40) {
        this.movement.y = 40
    } else if (this.movement.y < -40) {
        this.movement.y = -40
    }
}

ship.prototype.updatePosition = function(p) {
    this.position.x += this.movement.x
    this.position.y += this.movement.y

    // Detect boundaries
    if (this.position.x > this.width) {
        this.position.x -= this.width
    } else if (this.position.x < 0) {
        this.position.x += this.width
    }
    if (this.position.y > this.height) {
        this.position.y -= this.height
    } else if (this.position.y < 0) {
        this.position.y += this.height
    }
}

ship.prototype.update = function() {
    // Make a smaller time value that's easier to work with
    var p = 1

    this.updateRotation(p)
    this.updateMovement(p)
    this.updatePosition(p)
}

ship.prototype.draw = function(ca) {
    var ctx = ca.ctx;

    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate((Math.PI / 180) * this.rotation)

    ctx.strokeStyle = this.color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(10, 10)
    ctx.lineTo(0, -20)
    ctx.lineTo(-10, 10)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
}

ship.prototype.collision = function(other) {
    var dx = this.position.x - other.x;
    var dy = this.position.y - other.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius + other.radius) {
        return true;
    }
    return false;
}