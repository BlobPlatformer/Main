"use strict";

/* Classes and Libraries */

/* Constants */
const CANVAS_WIDTH = 1120;
const CANVAS_HEIGHT = 800;
/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player(x,y) {
  this.state = "idle-right";
  this.position = {x: x, y: y};
  this.velocity = {x: 0, y: 0};
  this.gravity = {x: 0, y: 2};
  this.floor = 16*35;
  // TODO
  this.img = new Image()
  this.img.src = 'assets/img/Individual_Img/idle_right.png';
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
  if (this.position.y >= this.floor) { this.state = "idle-right";}
  switch (this.state) {
    case "idle-right":
      // set the velocity
      //this.velocity.x = 0;
      if(input.left) {
        if(this.velocity.x > -6) {
          this.velocity.x -= .5;
        }
      }
      else if(input.right) {
        if(this.velocity.x < 6) {
          this.velocity.x += .5;
        }
      }
      else {
        this.velocity.x = 0;
      }
      console.log(this.velocity.x);
      //else this.velocity.x = 0;
      break;
    case "jump":

      break;
  }

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  if(this.velocity.y < 14)
  {
    this.velocity.x += this.gravity.x;
    this.velocity.y += this.gravity.y;
  }
  // keep player on screen
  if(this.position.x < 0) this.position.x = 0;
  if(this.position.x > CANVAS_WIDTH-32) this.position.x = CANVAS_WIDTH-32;
  if(this.position.y < 0) this.position.y = 0;
  if(this.position.y > this.floor) this.position.y = this.floor;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
  ctx.drawImage(this.img, this.position.x, this.position.y, 32, 32);
}

Player.prototype.jump = function() {
  if (this.position.y == this.floor) {
    this.state = "jump";
    this.velocity.y = -20;
  }
}
