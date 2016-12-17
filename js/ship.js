var ship = function(width, height) {
    position = {
        x: (width / 2),
        y: (height / 2)
    }
    movement = {
        x: 0,
        y: 0
    }
    rotation = 0
}


ship.prototype.update = function(progress) {
    // Make a smaller time value that's easier to work with
    var p = progress / 16

    updateRotation(p)
    updateMovement(p)
    updatePosition(p)
}

ship.prototype.updateRotation = function(p) {
    if (state.pressedKeys.left) {
        state.rotation -= p * 5
    } else if (state.pressedKeys.right) {
        state.rotation += p * 5
    }
}

ship.prototype.updateMovement = function(p) {
    // Behold! Mathematics for mapping a rotation to it's x, y components
    var accelerationVector = {
        x: p * .3 * Math.cos((this.rotation - 90) * (Math.PI / 180)),
        y: p * .3 * Math.sin((this.rotation - 90) * (Math.PI / 180))
    }

    if (state.pressedKeys.up) {
        state.movement.x += accelerationVector.x
        state.movement.y += accelerationVector.y
    } else if (state.pressedKeys.down) {
        state.movement.x -= accelerationVector.x
        state.movement.y -= accelerationVector.y
    }

    // Limit movement speed
    if (state.movement.x > 40) {
        state.movement.x = 40
    } else if (state.movement.x < -40) {
        state.movement.x = -40
    }
    if (state.movement.y > 40) {
        state.movement.y = 40
    } else if (state.movement.y < -40) {
        state.movement.y = -40
    }
}

ship.updatePosition = function(p) {
    state.position.x += state.movement.x
    state.position.y += state.movement.y

    // Detect boundaries
    if (state.position.x > width) {
        state.position.x -= width
    } else if (state.position.x < 0) {
        state.position.x += width
    }
    if (state.position.y > height) {
        state.position.y -= height
    } else if (state.position.y < 0) {
        state.position.y += height
    }
}

ship.draw = function() {
    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(state.position.x, state.position.y)
    ctx.rotate((Math.PI / 180) * state.rotation)

    ctx.strokeStyle = 'white'
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