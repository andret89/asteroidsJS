/**
 * Wrapper around window.requestAnimationFrame (rAF)
 * 
 * @param  {function} callback the function to animate
 */
// handle multiple browsers for requestAnimationFrame()
window.requestAnimFrame = (function(callback) {

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function log(s) { console.log(s + '') }


function Extends(objSub, objSup) {
    //eredita da GameObject
    objSub.prototype = Object.create(objSup.prototype);

    //reimposta il constructor
    objSub.prototype.constructor = objSub;
}

var state = {
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false,
        space: false
    },
    mousePos: {
        x: 0,
        y: 0
    }
}

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down',
    32: 'space'
}

function keydown(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
}

function keyup(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

function savePosMouse(event) {
    state.mousePos.x = event.clientX
    state.mousePos.y = event.clientY
    console.log(state.mousePos.x + ', ' + state.mousePos.y)
}

window.addEventListener("keydown", keydown, false)
window.addEventListener("keyup", keyup, false)

window.addEventListener("mouseup", savePosMouse, false)

/*
// Define the Person constructor
var Person = function(firstName) {
  this.firstName = firstName;
};

// Add a couple of methods to Person.prototype
Person.prototype.walk = function(){
  console.log("I am walking!");
};

Person.prototype.sayHello = function(){
  console.log("Hello, I'm " + this.firstName);
};

// Define the Student constructor
function Student(firstName, subject) {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  Person.call(this, firstName);

  // Initialize our Student-specific properties
  this.subject = subject;
};

// Create a Student.prototype object that inherits from Person.prototype.
// Note: A common error here is to use "new Person()" to create the
// Student.prototype. That's incorrect for several reasons, not least 
// that we don't have anything to give Person for the "firstName" 
// argument. The correct place to call Person is above, where we call 
// it from Student.
Student.prototype = Object.create(Person.prototype); // See note below

// Set the "constructor" property to refer to Student
Student.prototype.constructor = Student;

// Replace the "sayHello" method
Student.prototype.sayHello = function(){
  console.log("Hello, I'm " + this.firstName + ". I'm studying "
              + this.subject + ".");
};

// Add a "sayGoodBye" method
Student.prototype.sayGoodBye = function(){
  console.log("Goodbye!");
};

// Example usage:
var student1 = new Student("Janet", "Applied Physics");
student1.sayHello();   // "Hello, I'm Janet. I'm studying Applied Physics."
student1.walk();       // "I am walking!"
student1.sayGoodBye(); // "Goodbye!"

// Check that instanceof works correctly
console.log(student1 instanceof Person);  // true 
console.log(student1 instanceof Student); // true
*/