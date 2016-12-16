"use strict";

/* Classes and Libraries */

/* Constants */
const CANVAS_WIDTH = 1120;
const CANVAS_HEIGHT = 800;
const MS_PER_FRAME = 1000/8;
const FRAME = {source_frame_width: 64,
               source_frame_height: 64,
               dest_frame_width: 32,
               dest_frame_height: 32
};
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
  this.state = "idle";
  this.position = {x: x, y: y};
  this.redicule = {x: x, y: y};
  this.velocity = {x: 0, y: 0};
  this.gravity = {x: 0, y: 2};
  this.floor = 640;
  // TODO
  this.img = new Image()
  //this.img.src = 'assets/img/Individual_Img/idle_right.png';
  this.img.src = 'assets/img/Sprite_Sheets/animations.png';

  this.actualFrame = {x: 1, y: 0}; // Position of an inner frame in sprite sheet`
  this.frame = FRAME; // Frame properties, width, height of source and destination
  this.direction = "right";
  this.time = MS_PER_FRAME;

  this.storedFH = 0;
  this.storedF = 0;
  this.previousState = "moving";
  this.isdead = false;
  this.health = 100;
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
  //if(!this.isdead){
  switch (this.state) {
    case "idle":
      this.time += elapsedTime;
      // landing
      if (this.previousState == "falling") {
        if (this.time <= MS_PER_FRAME) {
          this.actualFrame.y = 3;
          this.actualFrame.x = 3;
        }
        else if (this.time <= 2*MS_PER_FRAME) {
          this.actualFrame.y = 3;
          this.actualFrame.x = 2;
        }
        else if (this.time <= 3*MS_PER_FRAME) {
          this.actualFrame.y = 3;
          this.actualFrame.x = 1;
        }
        else if (this.time <= 4*MS_PER_FRAME) {
          this.actualFrame.y = 3;
          this.actualFrame.x = 0;
        }
        else {
          this.actualFrame.y = this.storedFH;
          this.actualFrame.x = this.storedF;
        }
      }
      else if (this.previousState == "moving") {
        if (this.time <= MS_PER_FRAME) {
          this.actualFrame.y = this.storedF+1; //bit of a hack here, i can explain in class
          this.actualFrame.x = 0;
        }
        else {
          this.actualFrame.y = this.storedFH;
          this.actualFrame.x = this.storedF;
        }
      }


      // set the velocity
      //this.velocity.x = 0;
      if(input.left) {
        this.direction = "left";
        this.actualFrame.y = 1;
        this.actualFrame.x = 0;
        this.time = 0;
        this.state = "moving";
      }
      else if(input.right) {
        this.direction = "right";
        this.actualFrame.y = 2;
        this.actualFrame.x = 0;
        this.time = 0;
        this.state = "moving";
      }
      else {
        this.velocity.x = 0;
      }
      break;
    case "moving":
      // set the velocity
      //this.velocity.x = 0;
      this.time += elapsedTime;
      if(input.left) {
        this.actualFrame.y = 1;
        if(this.velocity.x > -8) {
          this.velocity.x -= 1;
        }
        if (this.time >= MS_PER_FRAME && this.time <= 2*MS_PER_FRAME) { this.actualFrame.x = 0;}
        if (this.time >= 2*MS_PER_FRAME) { this.actualFrame.x = 1; }
      }
      else if(input.right) {
        this.actualFrame.y = 2;
        if(this.velocity.x < 8) {
          this.velocity.x += 1;
        }
        if (this.time >= MS_PER_FRAME && this.time <= 2*MS_PER_FRAME) { this.actualFrame.x = 0;}
        if (this.time >= 2*MS_PER_FRAME) { this.actualFrame.x = 1; }
      }
      else {
        this.time = 0;
        this.storedFH = 0;
        this.previousState = "moving";
        if (this.direction == "right") { this.storedF = 1;}
        else this.storedF = 0;
        this.state = "idle";
      }
      break;
    case "falling":
      // set the velocity
      //this.velocity.x = 0;
      if (this.position.y == this.floor) {
        this.storedFH = 0;
        if (this.direction == "left") this.storedF = 0;
        else this.storedF = 1;
        this.time = 0;
        this.state = "idle";
      }
      else if(input.left) {
        if(this.velocity.x > -8) {
          this.velocity.x -= 1;
        }
      }
      else if(input.right) {
        if(this.velocity.x < 8) {
          this.velocity.x += 1;
        }
      }
      else {
        this.velocity.x = 0;
      }
      break;
    case "jump":
      this.time += elapsedTime;
      if (this.time <= MS_PER_FRAME) {
        this.actualFrame.y = 3;
        this.actualFrame.x = 0;
      }
      else if (this.time <= 2*MS_PER_FRAME) {
        this.actualFrame.y = 3;
        this.actualFrame.x = 1;
      }
      else if (this.time <= 3*MS_PER_FRAME) {
        this.actualFrame.y = 3;
        this.actualFrame.x = 2;
      }
      else if (this.time <= 4*MS_PER_FRAME) {
        this.actualFrame.y = 3;
        this.actualFrame.x = 3;
      }
      else {
        this.actualFrame.y = 3;
        this.actualFrame.x = 4;
      }

      if (this.velocity.y > 0) {
        this.actualFrame.y = 3;
        this.actualFrame.x = 4;
        this.state = "falling";
      }
      else if(input.left) {
        if(this.velocity.x > -8) {
          this.velocity.x -= 1;
        }
      }
      else if(input.right) {
        if(this.velocity.x < 8) {
          this.velocity.x += 1;
        }
      }
      else {
        this.velocity.x = 0;
      }
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
  if(this.position.x > CANVAS_WIDTH+16*700) this.position.x = CANVAS_WIDTH+16*700;
  if(this.position.y < 0) this.position.y = 0;
  if(this.position.y > this.floor) this.position.y = this.floor;
//}
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
  //ctx.drawImage(this.img, this.redicule.x, this.redicule.y, 32, 32);
  //if(!this.isdead){
    ctx.drawImage(this.img,
                  this.actualFrame.x * this.frame.source_frame_width,
                  this.actualFrame.y * this.frame.source_frame_height,
                  this.frame.source_frame_width,
                  this.frame.source_frame_height,
                  this.redicule.x,
                  this.redicule.y,
                  this.frame.dest_frame_width,
                  this.frame.dest_frame_height
    );
  //}

}

Player.prototype.jump = function() {
  if (this.position.y == this.floor) {
    this.time = 0;
    this.state = "jump";
    this.velocity.y = -30;
  }
}
